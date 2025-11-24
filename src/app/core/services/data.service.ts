import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';

/**
 * Service générique pour charger les données JSON mockées
 */
@Injectable({
  providedIn: 'root'
})
export class DataService {
  /**
   * Charge un fichier JSON depuis assets/data
   */
  loadJsonData<T>(fileName: string): Observable<T> {
    return from(
      fetch(`assets/data/${fileName}.json`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Erreur lors du chargement de ${fileName}`);
          }
          return response.json();
        })
    );
  }
}
