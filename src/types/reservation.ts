export default interface Reservation {
_id: string;
itemId: string;
userId: string;
bookingDate: string;
timeSlots: string[];
status: "pending" | "confirmed" | "expired";
expiration: Date;
createdAt?: Date;
updatedAt?: Date;
itemPrice?: number;
totalPrice?: number;
}