import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { ProductsService } from '../products.service';
import { Iproduct } from '../iproduct';

@Component({
  selector: 'app-products',
  standalone: true,
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Iproduct[] = [];

  constructor(
    private _productsService: ProductsService,
    private elRef: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this._productsService.getProducts().subscribe({
      next: (res) => {
        this.products = res;
        console.log(this.products);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  ngAfterViewInit(): void {
    const cardContainers = this.elRef.nativeElement.querySelectorAll('.card-container');

    cardContainers.forEach((container: HTMLElement) => {
      const card = container.querySelector('.card') as HTMLElement;

      this.renderer.listen(container, 'mousemove', (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (centerY - y) / 10;
        const rotateY = (x - centerX) / 10;

        this.renderer.setStyle(card, 'transform', `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`);
      });

      this.renderer.listen(container, 'mouseleave', () => {
        this.renderer.setStyle(card, 'transform', 'rotateX(0) rotateY(0) scale3d(1, 1, 1)');
      });

      this.renderer.listen(card, 'mouseenter', () => {
        this.renderer.setStyle(card, 'transition', 'none');
      });

      this.renderer.listen(card, 'mouseleave', () => {
        this.renderer.setStyle(card, 'transition', 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)');
      });
    });
  }
}
