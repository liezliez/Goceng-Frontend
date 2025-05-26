import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgForOf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StatsService } from '../../services/stats.service';

interface Stats {
  totalLoanDisbursed: string;
  appDownloads: string;
}

interface LoanOption {
  amount: string;
  duration: string;
}

interface Testimonial {
  name: string;
  age: number;
  amount: string;
  message: string;
}

type PlafonType = 'Bronze' | 'Silver' | 'Gold';

@Component({
  standalone: true,
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
  imports: [CommonModule, RouterModule, FormsModule, NgIf, NgForOf],
})
export class LandingPageComponent implements OnInit {
  stats: Stats = { totalLoanDisbursed: '', appDownloads: '35,000' };
  loanOptions: LoanOption[] = [];
  testimonials: Testimonial[] = [];
  currentYear: number = new Date().getFullYear();

  plafonTypes: PlafonType[] = ['Bronze', 'Silver', 'Gold'];
  selectedPlafon: PlafonType = 'Bronze';

  loanAmount: number = 1000000;
  loanTenor: number = 6;
  tenorOptions = [3, 6, 9, 12];

  simulationResult = {
    interest: 0,
    principal: 0,
    total: 0,
    installment: 0,
  };

  interestRates: Record<PlafonType, number> = {
    Bronze: 0.12,
    Silver: 0.10,
    Gold: 0.08,
  };

  constructor(private statsService: StatsService) {}

  ngOnInit(): void {
    this.fetchTotalLoanDisbursed();

    this.loanOptions = [
      { amount: 'Rp 1,000,000', duration: '3 bulan' },
      { amount: 'Rp 2,500,000', duration: '6 bulan' },
      { amount: 'Rp 5,000,000', duration: '12 bulan' },
    ];

    this.testimonials = [
      {
        name: 'Andi Wijaya',
        age: 29,
        amount: 'Rp 3,000,000',
        message: 'Aplikasinya sangat membantu di saat mendesak. Proses cepat!',
      },
      {
        name: 'Sari Dewi',
        age: 35,
        amount: 'Rp 5,000,000',
        message: 'Pelayanannya bagus dan terpercaya. Sangat direkomendasikan!',
      },
      {
        name: 'Budi Santoso',
        age: 40,
        amount: 'Rp 1,500,000',
        message: 'Mudah digunakan dan bunga kompetitif. Cocok untuk kebutuhan darurat.',
      },
    ];

    this.simulateLoan();
  }

  fetchTotalLoanDisbursed() {
    this.statsService.getLoanTotalDisbursed().subscribe({
      next: (totalLoan: number) => {
        const formatted = new Intl.NumberFormat('id-ID').format(totalLoan);
        this.stats.totalLoanDisbursed = `Rp ${formatted}`;
      },
      error: (err) => {
        console.error('Failed to fetch total loan disbursed:', err);
        this.stats.totalLoanDisbursed = 'Rp 0';
      }
    });
  }


  selectPlafon(plafon: PlafonType) {
    this.selectedPlafon = plafon;
    this.simulateLoan();
  }

  simulateLoan() {
    if (!this.loanAmount || this.loanAmount <= 0) {
      this.simulationResult = { interest: 0, principal: 0, total: 0, installment: 0 };
      return;
    }
    if (!this.loanTenor || !this.tenorOptions.includes(this.loanTenor)) {
      this.simulationResult = { interest: 0, principal: 0, total: 0, installment: 0 };
      return;
    }

    const annualInterestRate = this.interestRates[this.selectedPlafon];
    const monthlyInterestRate = annualInterestRate / 12;

    const P = this.loanAmount;
    const r = monthlyInterestRate;
    const n = this.loanTenor;

    let installment = 0;

    if (r === 0) {
      installment = P / n;
    } else {
      const onePlusRPowerN = Math.pow(1 + r, n);
      installment = (P * r * onePlusRPowerN) / (onePlusRPowerN - 1);
    }

    const total = installment * n;
    const interest = total - P;

    this.simulationResult = {
      interest,
      principal: P,
      total,
      installment,
    };
  }

  openLoanDetails(index: number) {
    const el = document.getElementById('loanSimulatorSection');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    const modalId = `loanModal${index}`;
    const modalEl = document.getElementById(modalId);
    if (modalEl) {
      // @ts-ignore
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  scrollToSimulator() {
    const element = document.getElementById('loanSimulatorSection');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  getPlafonClass(plafon: PlafonType): string {
    switch (plafon) {
      case 'Bronze':
        return 'bg-bronze';
      case 'Silver':
        return 'bg-silver';
      case 'Gold':
        return 'bg-gold';
      default:
        return '';
    }
  }
}
