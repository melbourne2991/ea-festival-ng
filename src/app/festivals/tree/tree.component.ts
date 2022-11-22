import { Component, HostBinding, Input } from '@angular/core';
import { TreeNode } from '../festivals-data-formatter';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css']
})
export class TreeComponent {

  @Input()
  label?: string = "";

  @Input()
  children?: TreeNode[] = []

  @HostBinding("class.spacing") @Input()
  spacing: boolean = false;
}
