import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class UtilService {
    public loadFromStorage(key) {
        const val = localStorage.getItem(key);
        return (val) ? JSON.parse(val) : null;
    }
    public saveToStorage(key, val) {
        localStorage[key] = JSON.stringify(val);
    }
}
