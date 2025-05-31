import React, { useState } from "react";
import Modal from "../Modal"
import CreateMod from "./CreateMod";

const YourMods: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <div>
      
      <Modal 
      isOpen={isOpen}
      children={<CreateMod />}
      />
    </div>
  )
}

export default YourMods