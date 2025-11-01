import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { Shipment } from '../../models/shipment.model';

@Component({
    selector: 'app-admin-order-tracking-map',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="tracking-map-container">
      <div id="tracking-map" [style.height]="height"></div>
    </div>
  `,
    styles: [`
    .tracking-map-container {
      width: 100%;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    #tracking-map {
      width: 100%;
    }

    :host ::ng-deep .custom-map-marker {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 3px solid white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    :host ::ng-deep .custom-marker {
      background: transparent;
      border: none;
    }

    :host ::ng-deep .marker-title {
      position: absolute;
      top: 35px;
      left: 50%;
      transform: translateX(-50%);
      background: white;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 10px;
      white-space: nowrap;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
      font-weight: 600;
    }

    :host ::ng-deep .leaflet-popup-content-wrapper {
      border-radius: 8px;
      padding: 0;
    }

    :host ::ng-deep .leaflet-popup-content {
      margin: 12px;
      font-size: 13px;
      line-height: 1.5;
    }
  `]
})
export class AdminOrderTrackingMapComponent implements OnInit, OnDestroy, OnChanges {
    @Input() shipment: Shipment | null = null;
    @Input() height: string = '400px';
    @Input() showRoute: boolean = true;
    @Input() showEvents: boolean = true;

    private map: L.Map | null = null;
    private routePolyline: L.Polyline | null = null;
    private markers: L.Marker[] = [];
    private eventMarkers: L.Marker[] = [];
    private animationInterval: any = null;

    private mapConfig = {
        zoom: 5,
        minZoom: 3,
        maxZoom: 18,
        zoomControl: true
    };

    private icons = {
        origin: this.createCustomIcon('📦', '#10b981', 'Origin'),
        destination: this.createCustomIcon('🏁', '#ef4444', 'Destination'),
        current: this.createCustomIcon('🚚', '#3b82f6', 'Current Location'),
        event: this.createCustomIcon('📍', '#f59e0b', 'Event'),
        completed: this.createCustomIcon('✓', '#10b981', 'Completed'),
        pending: this.createCustomIcon('⏰', '#6b7280', 'Pending')
    };

    ngOnInit() {
        // Delay map initialization to ensure DOM is ready
        setTimeout(() => {
            this.initMap();
            if (this.shipment) {
                this.updateMap();
            }
        }, 0);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['shipment'] && !changes['shipment'].firstChange && this.shipment) {
            setTimeout(() => {
                this.updateMap();
            }, 100);
        }
    }

    ngOnDestroy() {
        this.destroyMap();
    }

    private initMap() {
        const mapElement = document.getElementById('tracking-map');
        if (!mapElement) return;

        try {
            this.map = L.map('tracking-map', {
                zoomControl: this.mapConfig.zoomControl,
                minZoom: this.mapConfig.minZoom,
                maxZoom: this.mapConfig.maxZoom
            });

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 19
            }).addTo(this.map);

            this.map.setView([39.8283, -98.5795], this.mapConfig.zoom);
        } catch (error) {
            console.error('Error initializing map:', error);
        }
    }

    private updateMap() {
        if (!this.map || !this.shipment) return;

        this.clearMap();

        const originCoords = this.getCoordinatesFromAddress(this.shipment.origin);
        const destCoords = this.getCoordinatesFromAddress(this.shipment.destination);

        if (originCoords && destCoords) {
            this.addMarker(
                originCoords,
                'Origin',
                this.icons.origin,
                `
          <strong>Origin</strong><br>
          ${this.shipment.origin}<br>
          Shipped: ${this.formatDate(this.shipment.shippedDate)}
        `
            );

            this.addMarker(
                destCoords,
                'Destination',
                this.icons.destination,
                `
          <strong>Destination</strong><br>
          ${this.shipment.destination}<br>
          Est. Delivery: ${this.formatDate(this.shipment.estimatedDelivery)}
        `
            );

            if (this.showRoute) {
                this.addRoute(originCoords, destCoords);
            }

            if (this.showEvents) {
                this.addEventMarkers();
            }

            this.addCurrentLocationMarker();
            this.fitMapToMarkers();
        }
    }

    private addCurrentLocationMarker() {
        if (!this.shipment || !this.map) return;

        const currentEvent = this.shipment.events.find(
            (event) => !event.completed && event.status !== 'Delivered'
        ) || this.shipment.events[this.shipment.events.length - 1];

        if (currentEvent?.location) {
            const coords = this.getCoordinatesFromAddress(currentEvent.location);
            if (coords) {
                this.addMarker(
                    coords,
                    'Current Location',
                    this.icons.current,
                    `
            <strong>${currentEvent.status}</strong><br>
            ${currentEvent.location}<br>
            ${this.formatDate(currentEvent.timestamp)}<br>
            <em>${currentEvent.description}</em>
          `
                );
            }
        }
    }

    private addEventMarkers() {
        if (!this.shipment || !this.map) return;

        this.shipment.events
            .filter((event) => event.completed && event.location && !event.location.includes('En route'))
            .forEach((event) => {
                const coords = this.getCoordinatesFromAddress(event.location);
                if (coords) {
                    const marker = this.addMarker(
                        coords,
                        event.status,
                        this.icons.event,
                        `
              <strong>${event.status}</strong><br>
              ${event.location}<br>
              ${this.formatDate(event.timestamp)}<br>
              <em>${event.description}</em>
            `
                    );
                    this.eventMarkers.push(marker);
                }
            });
    }

    private addRoute(origin: L.LatLng, destination: L.LatLng) {
        if (!this.map) return;

        const midPoint = this.calculateMidpoint(origin, destination);
        const curvedRoute = this.createCurvedRoute(origin, destination, midPoint);

        this.routePolyline = L.polyline(curvedRoute, {
            color: '#3b82f6',
            weight: 4,
            opacity: 0.7,
            dashArray: '5, 10'
        }).addTo(this.map);

        this.animateRoute(this.routePolyline);
    }

    private createCurvedRoute(origin: L.LatLng, destination: L.LatLng, midPoint: L.LatLng): L.LatLng[] {
        const points: L.LatLng[] = [origin];

        const control1 = new L.LatLng(
            (origin.lat + midPoint.lat) / 2 + 2,
            (origin.lng + midPoint.lng) / 2
        );
        const control2 = new L.LatLng(
            (midPoint.lat + destination.lat) / 2 - 2,
            (midPoint.lng + destination.lng) / 2
        );

        for (let t = 0.1; t < 1; t += 0.1) {
            const point = this.cubicBezier(origin, control1, control2, destination, t);
            points.push(point);
        }

        points.push(destination);
        return points;
    }

    private cubicBezier(p0: L.LatLng, p1: L.LatLng, p2: L.LatLng, p3: L.LatLng, t: number): L.LatLng {
        const x = Math.pow(1 - t, 3) * p0.lat +
            3 * Math.pow(1 - t, 2) * t * p1.lat +
            3 * (1 - t) * Math.pow(t, 2) * p2.lat +
            Math.pow(t, 3) * p3.lat;

        const y = Math.pow(1 - t, 3) * p0.lng +
            3 * Math.pow(1 - t, 2) * t * p1.lng +
            3 * (1 - t) * Math.pow(t, 2) * p2.lng +
            Math.pow(t, 3) * p3.lng;

        return new L.LatLng(x, y);
    }

    private animateRoute(polyline: L.Polyline) {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
        }

        let dashOffset = 0;
        this.animationInterval = setInterval(() => {
            dashOffset = (dashOffset + 1) % 20;
            polyline.setStyle({ dashOffset: dashOffset.toString() });
        }, 100);
    }

    private addMarker(coords: L.LatLng, title: string, icon: L.DivIcon, popupContent: string): L.Marker {
        if (!this.map) throw new Error('Map not initialized');

        const marker = L.marker(coords, {
            title: title,
            icon: icon
        }).addTo(this.map);

        marker.bindPopup(popupContent);
        this.markers.push(marker);
        return marker;
    }

    private createCustomIcon(emoji: string, color: string, title: string): L.DivIcon {
        return L.divIcon({
            html: `
        <div class="custom-map-marker" style="background-color: ${color};">
          <span style="font-size: 16px;">${emoji}</span>
        </div>
        <div class="marker-title">${title}</div>
      `,
            className: 'custom-marker',
            iconSize: [30, 30],
            iconAnchor: [15, 30],
            popupAnchor: [0, -30]
        });
    }

    private getCoordinatesFromAddress(address: string): L.LatLng | null {
        const coordinates: { [key: string]: [number, number] } = {
            'Los Angeles, CA 90001': [34.0522, -118.2437],
            'New York, NY 10001': [40.7128, -74.006],
            'Phoenix, AZ Hub': [33.4484, -112.074],
            'Dallas, TX': [32.7767, -96.797],
            'Seattle, WA 98101': [47.6062, -122.3321],
            'Miami, FL 33101': [25.7617, -80.1918],
            'Salt Lake City, UT': [40.7608, -111.891],
            'Memphis, TN Hub': [35.1495, -90.049],
            'Chicago, IL 60601': [41.8781, -87.6298],
            'Boston, MA 02101': [42.3601, -71.0589]
        };

        const key = Object.keys(coordinates).find((k) => address.includes(k));
        return key ? new L.LatLng(coordinates[key][0], coordinates[key][1]) : null;
    }

    private calculateMidpoint(point1: L.LatLng, point2: L.LatLng): L.LatLng {
        return new L.LatLng(
            (point1.lat + point2.lat) / 2,
            (point1.lng + point2.lng) / 2
        );
    }

    private fitMapToMarkers() {
        if (!this.map || this.markers.length === 0) return;

        const group = new L.FeatureGroup(this.markers);
        this.map.fitBounds(group.getBounds().pad(0.1));
    }

    private clearMap() {
        this.markers.forEach((marker) => marker.remove());
        this.eventMarkers.forEach((marker) => marker.remove());
        if (this.routePolyline) {
            this.routePolyline.remove();
        }
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
        this.markers = [];
        this.eventMarkers = [];
        this.routePolyline = null;
    }

    private destroyMap() {
        this.clearMap();
        if (this.map) {
            this.map.remove();
            this.map = null;
        }
    }

    private formatDate(date: Date): string {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }

    // Public methods for component interaction
    public zoomToLocation(location: string) {
        const coords = this.getCoordinatesFromAddress(location);
        if (coords && this.map) {
            this.map.setView(coords, 10);
        }
    }

    public showAllEvents() {
        this.fitMapToMarkers();
    }

    public resetView() {
        this.updateMap();
    }
}
