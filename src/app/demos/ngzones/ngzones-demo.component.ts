import { Component, inject, NgZone, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-ngzones-demo',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './ngzones-demo.component.html',
  styleUrl: './ngzones-demo.component.css',
})
export class NgZonesDemoComponent {
  private zone = inject(NgZone);

  // ── Demo 1: runOutsideAngular ─────────────────────────────────────────────
  // Contador que roda fora da Zone (não dispara CD se app usar Zone-based)
  contadorExterno = signal(0);
  rodandoFora = signal(false);
  private _timer: ReturnType<typeof setInterval> | null = null;

  iniciarForaZone() {
    if (this.rodandoFora()) return;
    this.rodandoFora.set(true);

    // runOutsideAngular: código aqui NÃO dispara change detection
    // Em apps ZoneBased: UI não atualiza enquanto o interval corre.
    // Em apps Zoneless (como este): não muda nada pois Zone não gerencia CD.
    this.zone.runOutsideAngular(() => {
      this._timer = setInterval(() => {
        // Signal é reativo; mesmo fora da zone, o template detecta via signal
        this.contadorExterno.update(v => v + 1);

        // Para ao chegar em 10
        if (this.contadorExterno() >= 10) {
          this.pararContador();
        }
      }, 300);
    });
  }

  pararContador() {
    if (this._timer) clearInterval(this._timer);
    this._timer = null;
    this.rodandoFora.set(false);
  }

  resetarContador() {
    this.pararContador();
    this.contadorExterno.set(0);
  }

  // ── Demo 2: zone.run() — re-entrar na Zone ────────────────────────────────
  mensagemCallback = signal<string | null>(null);

  simularCallbackTerceiros() {
    // Simula um callback de lib de terceiros que roda fora da Zone Angular
    // Ex: socket.io, Google Maps, jQuery events
    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        // ⚠️ Se atualizarmos o signal aqui fora, em apps Zone-based a UI não reage.
        // zone.run() força a re-entrada na Zone e dispara CD normalmente.
        this.zone.run(() => {
          this.mensagemCallback.set(`✅ Callback recebido às ${new Date().toLocaleTimeString()}`);
        });
      }, 1000);
    });
    this.mensagemCallback.set('⏳ Aguardando callback...');
  }
}
