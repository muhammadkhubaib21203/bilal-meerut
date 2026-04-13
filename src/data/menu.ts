import seekhKabab from "@/assets/seekh-kabab.jpg";
import tikka from "@/assets/tikka.jpg";
import paratha from "@/assets/paratha.jpg";
import roll from "@/assets/roll.jpg";
import fries from "@/assets/fries.jpg";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  popular?: boolean;
}

export const categories = ["All", "BBQ", "Paratha", "Rolls", "Sides", "Drinks"];

export const menuItems: MenuItem[] = [
  { id: "1", name: "Seekh Kabab", description: "Juicy minced beef kabab grilled on charcoal, seasoned with traditional spices", price: 250, category: "BBQ", image: seekhKabab, popular: true },
  { id: "2", name: "Chicken Tikka", description: "Tender marinated chicken pieces grilled to perfection on skewers", price: 350, category: "BBQ", image: tikka, popular: true },
  { id: "3", name: "Beef Boti", description: "Premium beef chunks marinated in special spices and grilled on coal", price: 450, category: "BBQ", image: seekhKabab },
  { id: "4", name: "Malai Boti", description: "Creamy marinated chicken boti with a rich, buttery flavor", price: 400, category: "BBQ", image: tikka, popular: true },
  { id: "5", name: "Plain Paratha", description: "Crispy, flaky layered flatbread made fresh on tawa", price: 50, category: "Paratha", image: paratha },
  { id: "6", name: "Aloo Paratha", description: "Stuffed paratha with spiced potato filling, served hot", price: 80, category: "Paratha", image: paratha },
  { id: "7", name: "Kabab Paratha Roll", description: "Seekh kabab wrapped in fresh paratha with chutney and onions", price: 200, category: "Rolls", image: roll, popular: true },
  { id: "8", name: "Tikka Roll", description: "Chicken tikka wrapped in paratha with mint sauce", price: 250, category: "Rolls", image: roll },
  { id: "9", name: "French Fries", description: "Crispy golden fries seasoned with special masala", price: 150, category: "Sides", image: fries },
  { id: "10", name: "Loaded Fries", description: "Fries topped with cheese sauce and tikka pieces", price: 300, category: "Sides", image: fries },
  { id: "11", name: "Cold Drink (500ml)", description: "Pepsi, 7UP, Mirinda, or Dew", price: 80, category: "Drinks", image: fries },
  { id: "12", name: "Mint Raita", description: "Cool yogurt raita with fresh mint and spices", price: 60, category: "Sides", image: paratha },
];
