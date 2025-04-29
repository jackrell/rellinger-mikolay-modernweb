import React, { useState } from "react";

export default function Court({ slots, setSlots, selectedPlayers }) {
  const [dragOverSlotId, setDragOverSlotId] = useState(null);

  const handleDragStart = (event, player) => {
    event.dataTransfer.setData("player", JSON.stringify(player));
  };

  // handles dropping the player and adding to the slot (PG .. C)
  const handleDrop = (event, slotId) => {
    event.preventDefault();
    const player = JSON.parse(event.dataTransfer.getData("player"));

    setSlots(prevSlots => {
      const cleanedSlots = prevSlots.map(slot =>
        slot.player?.name === player.name ? { ...slot, player: null } : slot
      );
      return cleanedSlots.map(slot =>
        slot.id === slotId ? { ...slot, player } : slot
      );
    });

    setDragOverSlotId(null);
  };

  const allowDrop = (event, slotId) => {
    event.preventDefault();
    setDragOverSlotId(slotId);
  };

  const handleDragLeave = () => {
    setDragOverSlotId(null);
  };

  // removes player if you click on it
  const handleSlotClick = (slotId) => {
    setSlots(prev =>
      prev.map(slot =>
        slot.id === slotId ? { ...slot, player: null } : slot
      )
    );
  };

  return (
    <div className="relative w-[600px] h-[400px] mx-auto">
      {/* Court Image */}
      <img
        src="/Basketball_Halfcourt_Transparant.svg"
        alt="Basketball Court"
        className="w-full h-full object-cover"
      />

      {/* Slots */}
      {slots.map(slot => (
        <div
          key={slot.id}
          onClick={() => handleSlotClick(slot.id)}
          onDrop={(e) => handleDrop(e, slot.id)}
          onDragOver={(e) => allowDrop(e, slot.id)}
          onDragLeave={handleDragLeave}
          title={slot.player ? `Remove ${slot.player.name}` : `Assign ${slot.label}`}
          className={`
            absolute
            flex items-center justify-center
            w-20 h-20
            rounded-full
            text-sm font-bold
            cursor-pointer
            overflow-hidden
            transition-all
            ${dragOverSlotId === slot.id ? "border-4 border-blue-400" : "border-2 border-gray-400"}
            ${slot.player ? "bg-green-600 text-white" : "bg-neutral-800 text-gray-300"}
          `}
          style={{
            left: `${slot.x}px`,
            top: `${slot.y}px`,
          }}
        >
          {slot.player ? slot.player.name.split(" ")[0] : slot.label}
        </div>
      ))}

      {/* Available draggable players */}
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {selectedPlayers
          .filter(player => !slots.some(slot => slot.player?.name === player.name))
          .map((player, index) => (
            <div
              key={index}
              draggable
              onDragStart={(e) => handleDragStart(e, player)}
              className="px-4 py-2 bg-neutral-800 border border-neutral-600 rounded-md text-white font-semibold text-sm cursor-grab hover:bg-neutral-700 transition"
              title={player.name}
            >
              {player.name}
            </div>
          ))}
      </div>
    </div>
  );
}

