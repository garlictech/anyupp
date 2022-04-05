import { Observable } from 'rxjs';

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { visibleLinesOnViewport } from '@bgap/admin/shared/utils';
import { ChainCollectionService } from '@bgap/admin/store/chains';
import * as CrudApi from '@bgap/crud-gql/api';
import { NbDialogService } from '@nebular/theme';
import { UntilDestroy } from '@ngneat/until-destroy';

import { ChainListService } from '../../services/chain-list.service';
import { ChainFormComponent } from '../chain-form/chain-form.component';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-chain-list',
  templateUrl: './chain-list.component.html',
  styleUrls: ['./chain-list.component.scss'],
})
export class ChainListComponent implements OnDestroy {
  @ViewChild('dataVSVP')
  dataVSVP?: CdkVirtualScrollViewport;

  public loading$: Observable<boolean>;
  public chains$: Observable<CrudApi.Chain[]>;

  constructor(
    private _nbDialogService: NbDialogService,
    private _chainListService: ChainListService,
    private _chainCollectionService: ChainCollectionService,
  ) {
    this.chains$ = this._chainCollectionService.filteredEntities$;
    this.loading$ = this._chainCollectionService.loading$;
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  public addChain(): void {
    this._nbDialogService.open(ChainFormComponent);
  }

  public loadNextPaginatedData(count: number, itemCount: number) {
    if (
      itemCount - count <
      visibleLinesOnViewport(this.dataVSVP?.elementRef.nativeElement)
    ) {
      this._chainListService.loadNextPaginatedData();
    }
  }
}
