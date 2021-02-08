import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const ga: any;

@Injectable()
export class AnalyticsService {
  private enabled: boolean;

  constructor(private location: Location, private router: Router) {
    this.enabled = false;
  }

  public trackPageViews(): void {
    if (this.enabled) {
      this.router.events
        .pipe(filter((event): boolean => event instanceof NavigationEnd))
        .subscribe((): void => {
          ga('send', { hitType: 'pageview', page: this.location.path() });
        });
    }
  }

  public trackEvent(eventName: string): void {
    if (this.enabled) {
      ga('send', 'event', eventName);
    }
  }
}
