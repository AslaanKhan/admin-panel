import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface CustomCarouselProps {
  images: [{
    path: string
  }];
}

export function CustomCarousel({ images }: CustomCarouselProps) {
  return (
    <Carousel className="w-full max-w-xs">
      <CarouselContent>
        {images?.map((image, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <img src={image?.path} alt={`Image ${index + 1}`} className="object-cover w-full h-full" />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious aria-label="Previous item" />
      <CarouselNext aria-label="Next item" />
    </Carousel>
  );
}
