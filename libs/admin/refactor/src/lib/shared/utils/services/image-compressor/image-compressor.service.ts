import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EImageType } from '@bgap/shared/types';

@Injectable({
  providedIn: 'root',
})
export class ImageCompressorService {
  compress(
    file: File,
    imageType: EImageType,
    targetSize = 750,
  ): Observable<File> {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    return new Observable(observer => {
      reader.onload = ev => {
        const img = new Image();
        img.src = <string>ev.target?.result || '';

        (img.onload = () => {
          const elem = document.createElement('canvas'); // Use Angular's Renderer2 method
          let scaleFactor;

          if (Math.max(img.width, img.height) < targetSize) {
            // Not need to resize, return with the original file
            observer.next(file);
          } else {
            const ctx = <CanvasRenderingContext2D>elem.getContext('2d');

            if (img.width > img.height) {
              scaleFactor = targetSize / img.width;
              elem.width = targetSize;
              elem.height = img.height * scaleFactor;

              ctx.drawImage(img, 0, 0, targetSize, img.height * scaleFactor);
            } else {
              scaleFactor = targetSize / img.height;
              elem.height = targetSize;
              elem.width = img.width * scaleFactor;

              ctx.drawImage(img, 0, 0, img.width * scaleFactor, targetSize);
            }

            const ext = imageType === EImageType.JPEG ? '.jpg' : '.png';

            ctx.canvas.toBlob(
              blob => {
                if (blob) {
                  observer.next(
                    new File(
                      [blob],
                      file.name.substr(0, file.name.lastIndexOf('.')) + ext,
                      {
                        type: imageType,
                        lastModified: Date.now(),
                      },
                    ),
                  );
                }
              },
              imageType,
              0.8,
            );
          }
        }),
          (reader.onerror = error => observer.error(error));
      };
    });
  }
}
