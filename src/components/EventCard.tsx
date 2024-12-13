import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, MapPinIcon } from "lucide-react";

interface EventCardProps {
  id: string;
  title: string;
  date: string;
  location: string;
  imageUrl: string;
  description: string;
}

export default function EventCard({
  id,
  title,
  date,
  location,
  imageUrl,
  description,
}: EventCardProps) {
  return (
    <Card className="overflow-hidden hover-shadow hover-grow">
      <Image
        src={imageUrl}
        alt={title}
        width={400}
        height={200}
        className="w-full h-48 object-cover hover-bright"
      />
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-2">{description}</p>
        <div className="flex items-center text-sm text-muted-foreground mb-1">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date}
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPinIcon className="mr-2 h-4 w-4" />
          {location}
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full hover-bright">
          <Link href={`/events/${id}`}>Learn More</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
