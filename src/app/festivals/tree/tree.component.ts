import { Component, Input } from '@angular/core';
import { TreeNode } from '../festivals-data-formatter';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css']
})
export class TreeComponent {

  @Input()
  treeNode!: TreeNode;

  @Input()
  spacing: boolean = false;
}
