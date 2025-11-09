import { FaWhatsapp } from "react-icons/fa";
import './chat.scss';

const Chat = () => {
    return (
        // Anchor tag linking to WhatsApp chat with a specific phone number
        <a
            href="https://wa.me/201034403755"   // Replace with your actual WhatsApp number
            className="whatsapp-button"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
        >
            {/* WhatsApp icon inside the button */}
            <FaWhatsapp className="whatsapp-icon" />
        </a>
    );
}

export default Chat;