// "use client"
// import { useState } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { CalendarIcon } from "lucide-react";
// import { format } from "date-fns";
// import { cn } from "@/lib/utils";

// // Define the Tournament interface (your tournament structure)
// interface Tournament {
//   title: string;
//   game: string;
//   platform: string;
//   maxParticipants: number;
//   startDate: Date | undefined;
//   endDate: Date | undefined;
//   image: string;
// }

// // Define the props for CreateTournamentDialog, which includes onCreateTournament
// interface CreateTournamentDialogProps {
//   onCreateTournament: (tournament: Tournament) => void;
// }

// export function CreateTournamentDialog({
//   onCreateTournament,
// }: CreateTournamentDialogProps) {
//   const [open, setOpen] = useState(false);
//   const [startDate, setStartDate] = useState<Date | undefined>();
//   const [endDate, setEndDate] = useState<Date | undefined>();

//   // Handle form submission
//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     const form = e.target as HTMLFormElement;
//     const formData = new FormData(form);

//     // Create the tournament object from form data
//     const tournament: Tournament = {
//       title: formData.get("title") as string,
//       game: formData.get("game") as string,
//       platform: formData.get("platform") as string,
//       maxParticipants: Number(formData.get("maxParticipants")),
//       startDate,
//       endDate,
//       image: "/placeholder.svg?height=300&width=400", // Handle image upload here
//     };

//     // Call the onCreateTournament function passed via props
//     onCreateTournament(tournament);

//     // Reset form and close dialog
//     setOpen(false);
//     form.reset();
//   };

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button className="bg-blue-600 hover:bg-blue-700 transition-all duration-300">
//           Create Tournament
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white">
//         <DialogHeader>
//           <DialogTitle>Create New Tournament</DialogTitle>
//         </DialogHeader>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="space-y-2">
//             <Label htmlFor="title">Tournament Title</Label>
//             <Input
//               id="title"
//               name="title"
//               placeholder="Enter tournament title"
//               className="bg-gray-800 border-gray-700"
//               required
//             />
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="game">Game</Label>
//             <Select name="game" required>
//               <SelectTrigger className="bg-gray-800 border-gray-700">
//                 <SelectValue placeholder="Select game" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="pubg">PUBG</SelectItem>
//                 <SelectItem value="apex">Apex Legends</SelectItem>
//                 <SelectItem value="rocket-league">Rocket League</SelectItem>
//                 <SelectItem value="warzone">Call of Duty: Warzone</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="platform">Platform</Label>
//             <Select name="platform" required>
//               <SelectTrigger className="bg-gray-800 border-gray-700">
//                 <SelectValue placeholder="Select platform" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="playstation">PlayStation</SelectItem>
//                 <SelectItem value="xbox">Xbox</SelectItem>
//                 <SelectItem value="pc">PC</SelectItem>
//                 <SelectItem value="all">All Platforms</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="maxParticipants">Max Participants</Label>
//             <Input
//               id="maxParticipants"
//               name="maxParticipants"
//               type="number"
//               min="2"
//               max="1000"
//               className="bg-gray-800 border-gray-700"
//               required
//             />
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label>Start Date</Label>
//               <Popover>
//                 <PopoverTrigger asChild>
//                   <Button
//                     variant="outline"
//                     className={cn(
//                       "w-full justify-start text-left font-normal bg-gray-800 border-gray-700",
//                       !startDate && "text-muted-foreground"
//                     )}
//                     onClick={() => {
//                       const newDate = new Date(); // Simulate date selection
//                       setStartDate(newDate); // Update start date when date is picked
//                     }}
//                   >
//                     <CalendarIcon className="mr-2 h-4 w-4" />
//                     {startDate ? format(startDate, "PPP") : "Pick date"}
//                   </Button>
//                 </PopoverTrigger>
//                 <PopoverContent className="w-auto p-0">
//                   {/* You can implement your date picker logic here */}
//                 </PopoverContent>
//               </Popover>
//             </div>

//             <div className="space-y-2">
//               <Label>End Date</Label>
//               <Popover>
//                 <PopoverTrigger asChild>
//                   <Button
//                     variant="outline"
//                     className={cn(
//                       "w-full justify-start text-left font-normal bg-gray-800 border-gray-700",
//                       !endDate && "text-muted-foreground"
//                     )}
//                     onClick={() => {
//                       const newDate = new Date(); // Simulate date selection
//                       setEndDate(newDate); // Update end date when date is picked
//                     }}
//                   >
//                     <CalendarIcon className="mr-2 h-4 w-4" />
//                     {endDate ? format(endDate, "PPP") : "Pick date"}
//                   </Button>
//                 </PopoverTrigger>
//                 <PopoverContent className="w-auto p-0">
//                   {/* You can implement your date picker logic here */}
//                 </PopoverContent>
//               </Popover>
//             </div>
//           </div>

//           <Button
//             type="submit"
//             className="w-full bg-blue-600 hover:bg-blue-700"
//           >
//             Create Tournament
//           </Button>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }

export default function TournamentsPage() {
  return (
    <div>
      <h1>Tournaments</h1>
    </div>
  )
}