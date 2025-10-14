import React from "react";

export const Header = () => {
  return (
    <div className="space-y-2 text-center">
      <h1 className="text-4xl font-bold text-transparent bg-primary bg-clip-text pb-2">
        Hôm nay bạn muốn làm gì?
      </h1>

      <p className="text-muted-foreground">
        Những việc nhỏ mỗi ngày tạo nên khác biệt.
      </p>
    </div>
  );
};

