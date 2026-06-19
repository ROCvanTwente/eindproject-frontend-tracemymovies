import { useDragLayer } from "react-dnd";
import { Film } from "lucide-react";

function getDragLayerStyles(initialOffset, currentOffset) {
  if (!initialOffset || !currentOffset) return { display: "none" };
  const { x, y } = currentOffset;
  return { transform: `translate(${x}px, ${y}px)` };
}

export function FilmDragLayer() {
  const { isDragging, item, initialOffset, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    isDragging: monitor.isDragging(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
  }));

  if (!isDragging || !item) return null;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      <div style={getDragLayerStyles(initialOffset, currentOffset)}>
        <div
          style={{ width: item.width, height: item.height }}
          className="rounded-lg overflow-hidden shadow-2xl shadow-black/60 ring-2 ring-[#BFBCFC]"
        >
          {item.movie?.poster ? (
            <img src={item.movie.poster} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#151921]">
              <Film className="w-8 h-8 text-[#94A3B8]/20" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}