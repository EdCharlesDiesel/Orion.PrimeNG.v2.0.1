import { ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { provideRouter, withInMemoryScrolling, withEnabledBlockingInitialNavigation } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { productReducer } from './app/store/products/product.reducer';
import { cartReducer } from './app/store/cart/cart.reducer';
import { ProductEffects } from './app/store/products/product.effects';
import { InMemoryDataService } from './app/service/in-memory-data.service';
import { appRoutes } from './app.routes';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { ImageUploadEffects } from './app/store/image-upload/image-upload.effects';
import { ImageUploadReducer } from './app/store/image-upload/image-upload.reducer';

export const appConfig: ApplicationConfig = {
    providers: [
        // NgRx Store setup
        provideStore({ products: productReducer, cart: cartReducer,imageUpload: ImageUploadReducer  }),
        provideEffects([ProductEffects]),

        // NgRx DevTools (optional for dev)
        provideStoreDevtools({
            name: 'Orion ERP',
            maxAge: 25,
            logOnly: !isDevMode(),
            autoPause: true,
            trace: false
        }),

        // Router
        provideRouter(
            appRoutes,
            withInMemoryScrolling({
                anchorScrolling: 'enabled',
                scrollPositionRestoration: 'enabled'
            }),
            withEnabledBlockingInitialNavigation()
        ),

        // HTTP client + in-memory web API (for mock backend)
        provideHttpClient(withFetch()),
        importProvidersFrom(
            HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, {
                dataEncapsulation: false,
                delay: 500,
                passThruUnknownUrl: true
            })
        ),

        // Animations & PrimeNG
        provideAnimationsAsync(),
        providePrimeNG({
            theme: {
                preset: Aura,
                options: {
                    darkModeSelector: '.app-dark'
                }
            }
        })
    ]
};
