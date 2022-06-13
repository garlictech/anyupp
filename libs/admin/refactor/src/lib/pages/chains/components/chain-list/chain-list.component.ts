import { Observable } from 'rxjs';

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { Chain } from '@bgap/domain';
import { NbDialogService } from '@nebular/theme';
import { UntilDestroy } from '@ngneat/until-destroy';

import { visibleLinesOnViewport } from '../../../../shared/utils';
import { ChainCollectionService } from '../../../../store/chains';
import { ChainListService } from '../../services/chain-list.service';
import { ChainFormComponent } from '../chain-form/chain-form.component';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-chain-list',
  templateUrl: './chain-list.component.html',
  styleUrls: ['./chain-list.component.scss'],
})
export class ChainListComponent {
  @ViewChild('dataVSVP')
  dataVSVP?: CdkVirtualScrollViewport;

  public chains$: Observable<Chain[]>;

  constructor(
    private _nbDialogService: NbDialogService,
    private _chainListService: ChainListService,
    private _chainCollectionService: ChainCollectionService,
  ) {
    this.chains$ = this._chainCollectionService.filteredEntities$;
  }

  public addChain() {
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
