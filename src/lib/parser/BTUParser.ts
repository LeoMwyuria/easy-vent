import { Browser, Page } from 'puppeteer';
import puppeteer from 'puppeteer';


interface Lesson {
  time: string;
  room: string;
  subject: string;
  group: string;
  lecturer: string;
  additionalInfo: string;
}

export class BTUParser {
  private page!: Page;
  private browser!: Browser;

  async init() {
    console.log('1. Starting browser initialization');
    this.browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      args: [
        '--start-maximized',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage'
      ],
      ignoreDefaultArgs: ['--enable-automation'],
      slowMo: 100
    });
    
    this.page = await this.browser.newPage();
    await this.page.setDefaultNavigationTimeout(60000);
    console.log('2. Browser initialized');
    
    await this.page.goto('https://classroom.btu.edu.ge/ge/student/me/schedule');
    console.log('3. Waiting for login redirect');

    await this.page.waitForFunction(
      () => window.location.href.includes('/student/me/courses'),
      { timeout: 120000 }
    );
    
    console.log('4. Login successful, detected courses page');
    
    await this.page.goto('https://classroom.btu.edu.ge/ge/student/me/schedule');
    await this.page.waitForSelector('.table-responsive');
    await this.page.waitForFunction(() => {
      const table = document.querySelector('.table-responsive');
      if (!table) return false;
      const tableElement = table as HTMLElement;
      const content = tableElement.textContent;
      if (!content) return false;
      return content.length > 0;
    });
    console.log('5. Schedule loaded successfully');
    
    const schedule = await this.page.evaluate(() => {
      const schedule: Record<string, Lesson[]> = {};
      const table = document.querySelector('.table-responsive');
      const rows = table?.querySelectorAll('tr') || [];
      
      let currentDay = '';
      const dayHeaders = ['ორშაბათი', 'სამშაბათი', 'ოთხშაბათი', 'ხუთშაბათი', 'პარასკევი', 'შაბათი'];
      const dayMappings = {
        'ორშაბათი': 'monday',
        'სამშაბათი': 'tuesday',
        'ოთხშაბათი': 'wednesday',
        'ხუთშაბათი': 'thursday',
        'პარასკევი': 'friday',
        'შაბათი': 'saturday'
      };

      rows.forEach(row => {
        const headerCell = row.querySelector('td h4');
        if (headerCell) {
          const headerText = headerCell.textContent?.trim() || '';
          const dayMatch = dayHeaders.find(day => headerText.includes(day));
          if (dayMatch) {
            currentDay = dayMappings[dayMatch as keyof typeof dayMappings];
            schedule[currentDay] = [];
          }
        } else if (currentDay && row.cells.length >= 6) {
          const lesson = {
            time: row.cells[0]?.textContent?.trim() || '',
            room: row.cells[1]?.textContent?.trim() || '',
            subject: row.cells[2]?.textContent?.trim() || '',
            group: row.cells[3]?.textContent?.trim() || '',
            lecturer: row.cells[4]?.textContent?.trim() || '',
            additionalInfo: row.cells[5]?.textContent?.trim() || ''
          };
          
          if (lesson.subject && lesson.subject !== '-') {
            schedule[currentDay].push(lesson);
          }
        }
      });
      
      return schedule;
    });

    console.log('6. Schedule data extracted:', schedule);
    return schedule;
}

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}