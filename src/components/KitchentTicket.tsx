"use client";

import { KitchenQueueEntry } from "@/types/order";

export default function KitchenTicket({ entry }: { entry: KitchenQueueEntry }) {
  return (
    <div id="kitchen-ticket-print" className="hidden print:block">
      <h1 className="text-xl font-bold">Aangan</h1>
      <p className="mt-2 text-lg font-semibold">Order #{entry.orderNumber}</p>
      {entry.tableNumber && (
        <p className="text-lg font-semibold">Table {entry.tableNumber}</p>
      )}
      <p className="mt-1 text-sm">{new Date(entry.createdAt).toLocaleString()}</p>
      <hr className="my-2 border-black" />
      <ul className="flex flex-col gap-1">
        {entry.lines.map((line) => (
          <li key={line.itemId} className="flex items-center justify-between text-sm">
            <span>{line.name}</span>
            <span>× {line.quantity}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}