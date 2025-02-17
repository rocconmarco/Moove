import React from "react";

export const Footer = () => {
  return (
    <div className="flex justify-center min-h-0 z-20 py-5 px-1 mb-11 lg:mb-0">
      <div className="w-auto">
        <ul className="menu menu-horizontal w-full">
          <div className="flex flex-col">
            <div className="flex justify-center items-center gap-2 text-sm w-full">
              <div className="text-center">
                <a href="https://github.com/rocconmarco" target="_blank" rel="noreferrer" className="link">
                  GitHub
                </a>
              </div>
              <span>·</span>
              <div className="text-center">
                <a href="https://t.me/marcoroccon" target="_blank" rel="noreferrer" className="link">
                  Support
                </a>
              </div>
            </div>

            <div>
              <div className="flex justify-center items-center gap-2 text-sm w-full">
                <div className="flex justify-center items-center gap-2">
                  <p className="m-0 text-center">© 2025 Marco Roccon. All rights reserved.</p>
                </div>
              </div>
            </div>
          </div>
        </ul>
      </div>
    </div>
  );
};
