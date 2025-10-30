import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';
import { Shipment } from '../../models/shipment.model';


@Component({
    selector: 'app-admin-order-tracking-map',
    templateUrl: './admin-order-tracking-map.component.html',
    styleUrls: ['./admin-order-tracking-map.component.scss']
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

    // Map configuration
    private mapConfig = {
        zoom: 5,
        minZoom: 3,
        maxZoom: 15,
        zoomControl: true
    };

    // Custom icons
    private icons = {
        origin: this.createCustomIcon('pi-map-marker', '#10b981', 'Origin'),
        destination: this.createCustomIcon('pi-flag-fill', '#ef4444', 'Destination'),
        current: this.createCustomIcon('pi-truck', '#3b82f6', 'Current Location'),
        event: this.createCustomIcon('pi-circle-fill', '#f59e0b', 'Event Location'),
        completed: this.createCustomIcon('pi-check-circle', '#10b981', 'Completed'),
        pending: this.createCustomIcon('pi-clock', '#6b7280', 'Pending')
    };

    ngOnInit() {
        this.initMap();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['shipment'] && this.shipment) {
            setTimeout(() => {
                this.updateMap();
            }, 100);
        }
    }

    ngOnDestroy() {
        this.destroyMap();
    }

    private initMap() {
        if (!this.map) {
            this.map = L.map('tracking-map', {
                zoomControl: this.mapConfig.zoomControl,
                minZoom: this.mapConfig.minZoom,
                maxZoom: this.mapConfig.maxZoom
            });

            // Add OpenStreetMap tiles
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 19
            }).addTo(this.map);

            // Set initial view to US center
            this.map.setView([39.8283, -98.5795], this.mapConfig.zoom);
        }
    }

    private updateMap() {
        if (!this.map || !this.shipment) return;

        this.clearMap();

        // Get coordinates for origin and destination
        const originCoords = this.getCoordinatesFromAddress(this.shipment.origin);
        const destCoords = this.getCoordinatesFromAddress(this.shipment.destination);

        if (originCoords && destCoords) {
            // Add origin marker
            this.addMarker(originCoords, 'Origin', this.icons.origin, `
        <strong>Origin</strong><br>
        ${this.shipment.origin}<br>
        Shipped: ${this.formatDate(this.shipment.shippedDate)}
      `);

            // Add destination marker
            this.addMarker(destCoords, 'Destination', this.icons.destination, `
        <strong>Destination</strong><br>
        ${this.shipment.destination}<br>
        Est. Delivery: ${this.formatDate(this.shipment.estimatedDelivery)}
      `);

            // Add route if enabled
            if (this.showRoute) {
                this.addRoute(originCoords, destCoords);
            }

            // Add event markers if enabled
            if (this.showEvents) {
                this.addEventMarkers();
            }

            // Add current location marker
            this.addCurrentLocationMarker();

            // Fit map to show all markers
            this.fitMapToMarkers();
        }
    }

    private addCurrentLocationMarker() {
        if (!this.shipment || !this.map) return;

        const currentEvent = this.shipment.events.find(event =>
            !event.completed && event.status !== 'Delivered'
        ) || this.shipment.events[this.shipment.events.length - 1];

        if (currentEvent && currentEvent.location) {
            const coords = this.getCoordinatesFromAddress(currentEvent.location);
            if (coords) {
                this.addMarker(coords, 'Current Location', this.icons.current, `
          <strong>${currentEvent.status}</strong><br>
          ${currentEvent.location}<br>
          ${this.formatDate(currentEvent.timestamp)}<br>
          <em>${currentEvent.description}</em>
        `);
            }
        }
    }

    private addEventMarkers() {
        if (!this.shipment || !this.map) return;

        this.shipment.events
            .filter(event => event.completed && event.location && !event.location.includes('En route'))
            .forEach((event, index) => {
                const coords = this.getCoordinatesFromAddress(event.location);
                if (coords) {
                    const icon = event.completed ? this.icons.completed : this.icons.pending;
                    const marker = this.addMarker(coords, event.status, this.icons.event, `
            <strong>${event.status}</strong><br>
            ${event.location}<br>
            ${this.formatDate(event.timestamp)}<br>
            <em>${event.description}</em>
          `);

                    this.eventMarkers.push(marker);
                }
            });
    }

    private addRoute(origin: L.LatLng, destination: L.LatLng) {
        if (!this.map) return;

        // Create a simple curved route for demonstration
        // In real application, you might use a routing service like OSRM
        const midPoint = this.calculateMidpoint(origin, destination);
        const curvedRoute = this.createCurvedRoute(origin, destination, midPoint);

        this.routePolyline = L.polyline(curvedRoute, {
            color: '#3b82f6',
            weight: 4,
            opacity: 0.7,
            dashArray: '5, 10'
        }).addTo(this.map);

        // Add animation to the route
        this.animateRoute(this.routePolyline);
    }

    private createCurvedRoute(origin: L.LatLng, destination: L.LatLng, midPoint: L.LatLng): L.LatLng[] {
        // Create a curved route using Bezier curve approximation
        const points: L.LatLng[] = [origin];

        // Add control points for curvature
        const control1 = new L.LatLng(
            (origin.lat + midPoint.lat) / 2 + 2,
            (origin.lng + midPoint.lng) / 2
        );
        const control2 = new L.LatLng(
            (midPoint.lat + destination.lat) / 2 - 2,
            (midPoint.lng + destination.lng) / 2
        );

        // Generate curved path
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
        // Simple animation effect
        let dashOffset = 0;
        setInterval(() => {
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

    private createCustomIcon(iconClass: string, color: string, title: string): L.DivIcon {
        return L.divIcon({
            html: `
        <div class="custom-map-marker" style="background-color: ${color};">
          <i class="pi ${iconClass}" style="color: white; font-size: 12px;"></i>
        </div>
        <div class="marker-title">${title}</div>
      `,
            className: 'custom-marker',
            iconSize: [30, 30],
            iconAnchor: [15, 15],
            popupAnchor: [0, -15]
        });
    }

    private getCoordinatesFromAddress(address: string): L.LatLng | null {
        // Simplified geocoding - in real application, use a geocoding service
        const coordinates: { [key: string]: [number, number] } = {
            'Los Angeles, CA 90001': [34.0522, -118.2437],
            'New York, NY 10001': [40.7128, -74.0060],
            'Phoenix, AZ Hub': [33.4484, -112.0740],
            'Dallas, TX': [32.7767, -96.7970],
            'Seattle, WA 98101': [47.6062, -122.3321],
            'Miami, FL 33101': [25.7617, -80.1918],
            'Salt Lake City, UT': [40.7608, -111.8910],
            'Memphis, TN Hub': [35.1495, -90.0490],
            'Chicago, IL 60601': [41.8781, -87.6298],
            'Boston, MA 02101': [42.3601, -71.0589]
        };

        const key = Object.keys(coordinates).find(k => address.includes(k));
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
        this.markers.forEach(marker => marker.removeFrom(this.map!));
        this.eventMarkers.forEach(marker => marker.removeFrom(this.map!));
        if (this.routePolyline) {
            this.routePolyline.removeFrom(this.map!);
        }
        this.markers = [];
        this.eventMarkers = [];
        this.routePolyline = null;
    }

    private destroyMap() {
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
