import { List, Plus, Film } from "lucide-react";

export function FeaturedListsBrowse({ featuredLists, isAdmin, onCreateClick, onEditClick, onListClick }) {
  return (
    <div className="min-h-screen py-6 md:py-8 bg-[#0B0E14] text-[#F8FAFC]">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Layout structurally synchronized with image_ee73bb.png */}
        <div className="flex items-center justify-between mb-6 md:mb-8 border-b border-white/5 pb-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-black leading-none tracking-tight">
              <span className="bg-gradient-to-r from-[#BFBCFC] via-[#9b9dfc] to-[#44FFFF] bg-clip-text text-transparent">
                Featured Lists
              </span>
            </h1>
          </div>

          {/* Start New List Action Module - Restricted to Verified Admin Accounts */}
          {isAdmin && (
            <button
              onClick={onCreateClick}
              className="bg-[#BFBCFC] hover:bg-[#AFA9FF] text-[#0B0E14] px-4 md:px-6 py-2 md:py-3 rounded-xl border-2 border-[#BFBCFC] font-medium transition-all flex items-center gap-2 shadow-lg shadow-[#BFBCFC]/30 hover:scale-105 text-sm cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              <span>Start a New List</span>
            </button>
          )}
        </div>

        {/* Global Browsing Lists Output Container */}
        {featuredLists.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center border border-dashed border-white/5 rounded-3xl bg-[#151921]/20">
            <List className="w-12 h-12 text-[#BFBCFC]/20 mx-auto mb-4" />
            <h3 className="text-xl font-heading font-bold text-[#F8FAFC] mb-2">No featured lists yet</h3>
            <p className="text-[#94A3B8] text-sm">No featured lists available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredLists.map((list) => (
              <div
                key={list.listId}
                onClick={() => onListClick(list.listId)}
                className="bg-[#151921] border border-white/5 rounded-2xl p-5 hover:border-[#BFBCFC]/30 transition-all duration-300 cursor-pointer flex flex-col justify-between group shadow-xl"
              >
                <div>
                  <div className="grid grid-cols-3 gap-2 bg-[#0B0E14]/60 p-2.5 rounded-xl mb-4 aspect-[16/9] overflow-hidden content-center">
                    {list.previewPosters && list.previewPosters.filter(Boolean).length > 0 ? (
                      list.previewPosters.slice(0, 3).map((poster, i) => (
                        <img
                          key={i}
                          src={poster}
                          alt=""
                          className="w-full h-full object-cover rounded-lg shadow border border-white/5 transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                      ))
                    ) : (
                      <div className="col-span-3 flex items-center justify-center text-[#475569]">
                        <Film className="w-8 h-8 opacity-40" />
                      </div>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-[#F8FAFC] group-hover:text-[#BFBCFC] transition-colors line-clamp-1">
                    {list.listName}
                  </h3>
                  <p className="text-[#94A3B8] text-xs mt-1 line-clamp-2 min-h-[32px]">
                    {list.listDescription || "No description provided."}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-white/5 mt-4 pt-4 text-xs text-[#64748B]">
                  <span className="bg-white/5 px-2.5 py-1 rounded-md text-[#CBD5E1] font-medium">
                    {list.movieCount} {list.movieCount === 1 ? "film" : "films"}
                  </span>
                  {list.isRanked && (
                    <span className="bg-[#BFBCFC]/10 text-[#BFBCFC] px-2.5 py-1 rounded-md font-bold">
                      Ranked
                    </span>
                  )}
                  {isAdmin && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditClick(list.listId);
                      }}
                      className="text-[#44FFFF] hover:underline font-semibold"
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}