 
import SupportPage from "./Support";

import { connect } from "@/dbconfig/dbConfig"; // Example
import Faq from "@/models/faq"; // Example
async function getFaqData() {
  try {
    await connect();
    const faqs = await Faq.find({}).lean();
    if (!faqs) {
      return [];
    }
    console.log("Fetched FAQs:", faqs);

    const plainFaqs = JSON.parse(JSON.stringify(faqs));
    return plainFaqs;
  } catch (error) {
    console.error("========================================");
    console.error("!!! SERIALIZATION FAILED ON SERVER !!!");
    console.error("========================================");
    console.error("The error message is:", error.message);
   
    
    return [];
  }
}

export default async function SupportPageWrapper() {
  const initialFaqs = await getFaqData();
 

  return <SupportPage faqs={initialFaqs} />;
}
