import { useEffect, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Film, X } from "lucide-react";

const TRANSPARENT_PIXEL = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==";

export function DraggableFilmCard({ movie, index, isRanked, moveMovie, onDropEnd, onRemove }) {
  const ref = useRef(null);
  const posterRef = useRef(null);
  const previewImgRef = useRef(null);

  const [{ isDragging }, drag, preview] = useDrag({
    type: "NEW_LIST_MOVIE",
    item: () => {
      const rect = posterRef.current?.getBoundingClientRect();
      return { index, movie, width: rect?.width, height: rect?.height };
    },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    end: () => onDropEnd?.(),
  });

  useEffect(() => {
    if (previewImgRef.current) {
      preview(previewImgRef.current, { captureDraggingState: true });
    }
  }, [preview]);

  const [, drop] = useDrop({
    accept: "NEW_LIST_MOVIE",
    hover: (item, monitor) => {
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex || !ref.current) return;

      const hoverRect = ref.current.getBoundingClientRect();
      const hoverMiddleX = (hoverRect.right - hoverRect.left) / 2;
      const hoverMiddleY = (hoverRect.bottom - hoverRect.top) / 2;

      const clientOffset = monitor.getClientOffset();
      const hoverClientX = clientOffset.x - hoverRect.left;
      const hoverClientY = clientOffset.y - hoverRect.top;

      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX && hoverClientY > hoverMiddleY) return;

      moveMovie(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <div ref={ref} className={`group cursor-move ${isDragging ? "opacity-0" : ""}`}>
      <img
        ref={previewImgRef}
        src={TRANSPARENT_PIXEL}
        alt=""
        style={{ position: "fixed", top: -1, left: -1, width: 1, height: 1, opacity: 0, pointerEvents: "none" }}
      />
      <div ref={posterRef} className="relative rounded-lg overflow-hidden bg-[#151921]">
        <div className="aspect-[2/3]">
          {movie.poster ? (
            <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" loading="lazy" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#151921]">
              <Film className="w-8 h-8 text-[#94A3B8]/20" />
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => onRemove(movie.movieId)}
          className="absolute top-1.5 right-1.5 bg-[#FF61D2]/90 backdrop-blur-sm hover:bg-[#FF61D2] text-white p-1.5 rounded-lg transition-all shadow-lg opacity-0 group-hover:opacity-100"
          title="Remove from list"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <p className="mt-1.5 text-[#F8FAFC] text-xs font-medium truncate">{movie.title}</p>
      {isRanked && (
        <p className="text-center text-[#BFBCFC] font-bold font-heading text-sm">{index + 1}</p>
      )}
    </div>
  );
}