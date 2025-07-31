"use client";

import Link from "next/link";
import { useState } from "react";

interface Category {
  id: string;
  name: string;
  icon: string;
  posts?: string[];
}

interface Folder {
  id: string;
  name: string;
  categories: Category[];
  isOpen?: boolean;
}

const Sidebar = () => {
  const [folders, setFolders] = useState<Folder[]>([
    {
      id: "research",
      name: "Research",
      isOpen: true,
      categories: [
        {
          id: "web3-security",
          name: "Web3 Security",
          icon: "🔐",
          posts: ["introtoanchor", "lowlevelcalls"]
        },
        {
          id: "ml-data-science",
          name: "ML/Data Science",
          icon: "⚙️",
          posts: []
        }
      ]
    }
  ]);

  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleFolder = (folderId: string) => {
    setFolders(prev => 
      prev.map(folder => 
        folder.id === folderId 
          ? { ...folder, isOpen: !folder.isOpen }
          : folder
      )
    );
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  if (isCollapsed) {
    return (
      <div className="w-12 itunes-sidebar flex flex-col items-center py-4">
        <button
          onClick={toggleSidebar}
          className="itunes-button p-2 w-8 h-8 flex items-center justify-center"
          title="Expand sidebar"
        >
          <span className="text-gray-600 text-sm">▶</span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-64 itunes-sidebar h-full overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center mb-6">
          <button
            onClick={toggleSidebar}
            className="itunes-button p-1 w-6 h-6 flex items-center justify-center mr-2"
            title="Collapse sidebar"
          >
            <span className="text-gray-600 text-xs">◀</span>
          </button>
          <h2 className="text-lg font-semibold text-gray-800">Library</h2>
        </div>
        
        {folders.map((folder) => (
          <div key={folder.id} className="mb-3">
            <button
              onClick={() => toggleFolder(folder.id)}
              className="flex items-center justify-between w-full text-left p-2 rounded-md itunes-hover transition-colors"
            >
              <span className="font-medium text-gray-800 flex items-center">
                <span className="mr-2 text-blue-600">📁</span>
                {folder.name}
              </span>
              <span className={`transform transition-transform text-gray-500 ${folder.isOpen ? 'rotate-90' : ''}`}>
                ▶
              </span>
            </button>
            
            {folder.isOpen && (
              <div className="ml-4 mt-1 space-y-1">
                {folder.categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/category/${category.id}`}
                    className="flex items-center p-2 rounded-md itunes-hover transition-colors text-sm"
                  >
                    <span className="mr-2 text-gray-600">{category.icon}</span>
                    <span className="text-gray-700">{category.name}</span>
                    {category.posts && category.posts.length > 0 && (
                      <span className="ml-auto text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                        {category.posts.length}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
        
        <div className="border-t border-gray-200 pt-4 mt-6">
          <Link
            href="/"
            className="flex items-center p-2 rounded-md itunes-hover transition-colors"
          >
            <span className="mr-2 text-gray-600">🏠</span>
            <span className="text-gray-700">All Posts</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 