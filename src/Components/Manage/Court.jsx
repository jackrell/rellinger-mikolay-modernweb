// src/Components/Manage/Court.jsx

import React, { useState } from "react";

export default function Court({ slots, setSlots, selectedPlayers }) {
  const [dragOverSlotId, setDragOverSlotId] = useState(null);

  const handleDragStart = (event, player) => {
    event.dataTransfer.setData("player", JSON.stringify(player));
  };

  const handleDrop = (event, slotId) => {
    event.preventDefault();
    const player = JSON.parse(event.dataTransfer.getData("player"));

    setSlots(prevSlots => {
      // Remove player from any other slot they were in
      const cleanedSlots = prevSlots.map(slot =>
        slot.player?.name === player.name ? { ...slot, player: null } : slot
      );

      // Assign player to the new slot
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

  const handleSlotClick = (slotId) => {
    // Clicking removes player from the slot
    setSlots(prev =>
      prev.map(slot =>
        slot.id === slotId ? { ...slot, player: null } : slot
      )
    );
  };

  return (
    <div style={{ position: "relative", width: "600px", height: "400px", margin: "auto" }}>
      {/* Court Image */}
      <img
        src="/Basketball_Halfcourt_Transparant.svg"
        alt="Basketball Court"
        style={{ width: "100%", height: "100%" }}
      />

      {/* Slots */}
      {slots.map(slot => (
        <div
          key={slot.id}
          onClick={() => handleSlotClick(slot.id)}
          onDrop={(e) => handleDrop(e, slot.id)}
          onDragOver={(e) => allowDrop(e, slot.id)}
          onDragLeave={handleDragLeave}
          title={slot.player ? slot.player.name : slot.label} // Tooltip full name
          style={{
            position: "absolute",
            left: `${slot.x}px`,
            top: `${slot.y}px`,
            width: "80px",
            height: "80px",
            border: dragOverSlotId === slot.id ? "3px solid blue" : "2px dashed gray",
            borderRadius: "50%",
            textAlign: "center",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: slot.player ? "lightgreen" : "white",
            fontWeight: "bold",
            cursor: "pointer",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            transition: "border 0.2s ease",
            padding: "4px",
          }}
        >
          {slot.player ? slot.player.name.split(" ")[0] : slot.label}
        </div>
      ))}

      {/* Available draggable players */}
      <div style={{
        marginTop: "20px",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "0.5rem"
      }}>
        {selectedPlayers
          .filter(player => !slots.some(slot => slot.player?.name === player.name)) // Hide if assigned
          .map((player, index) => (
            <div
              key={index}
              draggable
              onDragStart={(e) => handleDragStart(e, player)}
              style={{
                padding: "0.5rem 1rem",
                border: "1px solid black",
                borderRadius: "5px",
                backgroundColor: "white",
                cursor: "grab",
                fontSize: "14px",
                fontWeight: "bold",
                maxWidth: "120px",
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap"
              }}
              title={player.name} // Tooltip for full name
            >
              {player.name}
            </div>
        ))}
      </div>
    </div>
  );
}
