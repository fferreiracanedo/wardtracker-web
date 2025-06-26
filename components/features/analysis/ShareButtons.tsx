"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Twitter, MessageSquare, Check, Copy } from "lucide-react";
import { generateShareText } from "@/lib/utils";
import { toast } from "sonner";

interface ShareButtonsProps {
  analysisUrl: string;
  wardScore: number;
  className?: string;
}

export default function ShareButtons({
  analysisUrl,
  wardScore,
  className,
}: ShareButtonsProps) {
  const [copiedDiscord, setCopiedDiscord] = useState(false);

  const shareTexts = generateShareText(wardScore, analysisUrl);

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareTexts.twitter
    )}`;
    window.open(twitterUrl, "_blank", "noopener,noreferrer");
  };

  const handleDiscordCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareTexts.discord);
      setCopiedDiscord(true);
      toast.success("Texto copiado para área de transferência!");

      setTimeout(() => {
        setCopiedDiscord(false);
      }, 2000);
    } catch (error) {
      toast.error("Erro ao copiar texto");
    }
  };

  return (
    <div className={`flex space-x-3 ${className}`}>
      {/* Twitter/X Share */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={handleTwitterShare}
            variant="outline"
            size="icon"
            className="h-10 w-10 hover:bg-blue-50 hover:border-blue-300"
            aria-label="Compartilhar no X (Twitter)"
          >
            <Twitter className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Compartilhar no X</p>
        </TooltipContent>
      </Tooltip>

      {/* Discord Copy */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={handleDiscordCopy}
            variant="outline"
            size="icon"
            className={`h-10 w-10 transition-all ${
              copiedDiscord
                ? "bg-green-50 border-green-300 text-green-600"
                : "hover:bg-purple-50 hover:border-purple-300"
            }`}
            aria-label="Copiar para Discord"
          >
            {copiedDiscord ? (
              <Check className="h-4 w-4" />
            ) : (
              <MessageSquare className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{copiedDiscord ? "Copiado!" : "Copiar para Discord"}</p>
        </TooltipContent>
      </Tooltip>

      {/* Generic Copy Link */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(analysisUrl);
              toast.success("Link copiado!");
            }}
            variant="outline"
            size="icon"
            className="h-10 w-10 hover:bg-gray-50 hover:border-gray-300"
            aria-label="Copiar link"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Copiar link</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
