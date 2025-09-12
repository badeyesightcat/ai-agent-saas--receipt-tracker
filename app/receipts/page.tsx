import DragAndDropZone from "@/components/DragAndDropZone";
import ReceiptList from "@/components/ReceiptList";

function Receipts() {
  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="col-span-1 lg:col-span-1">
          <DragAndDropZone />
        </div>
        <div className="col-span-1 lg:col-span-2">
          <ReceiptList />
        </div>
      </div>
    </div>
  );
}

export default Receipts;
