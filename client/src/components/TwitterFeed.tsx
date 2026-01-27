import { useEffect, useRef } from "react";

declare global {
  interface Window {
    twttr?: {
      widgets: {
        load: (element?: HTMLElement) => void;
      };
    };
  }
}

interface TwitterFeedProps {
  username: string;
  height?: number;
}

export function TwitterFeed({ username, height = 600 }: TwitterFeedProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const existingScript = document.querySelector('script[src="https://platform.twitter.com/widgets.js"]');
    
    if (existingScript) {
      if (window.twttr && containerRef.current) {
        window.twttr.widgets.load(containerRef.current);
      }
      return;
    }

    const script = document.createElement("script");
    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;
    script.charset = "utf-8";
    
    script.onload = () => {
      if (window.twttr && containerRef.current) {
        window.twttr.widgets.load(containerRef.current);
      }
    };

    document.body.appendChild(script);
  }, []);

  return (
    <div className="bg-white shadow-sm" data-testid="twitter-feed">
      <div className="bg-primary text-white p-4 border-b-4 border-secondary">
        <h3 className="font-bold text-lg">آخر التغريدات</h3>
        <p className="text-white/80 text-sm">@{username}</p>
      </div>
      <div 
        ref={containerRef}
        className="overflow-hidden"
        style={{ maxHeight: height }}
      >
        <a
          className="twitter-timeline"
          data-height={height}
          data-theme="light"
          data-chrome="noheader nofooter noborders transparent"
          data-dnt="true"
          href={`https://twitter.com/${username}?ref_src=twsrc%5Etfw`}
        >
          <div className="flex items-center justify-center p-8 text-muted-foreground">
            <div className="animate-pulse text-center">
              <div className="w-8 h-8 bg-gray-200 mx-auto mb-2" />
              <p className="text-sm">جاري تحميل التغريدات...</p>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}
