import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 relative overflow-hidden">
      <!-- Animated background elements -->
      <div class="absolute inset-0">
        <div class="absolute top-20 left-20 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div class="absolute top-40 right-20 w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float delay-200"></div>
        <div class="absolute bottom-20 left-1/2 w-80 h-80 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float delay-400"></div>
      </div>

      <div class="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div class="w-full max-w-md">
          <!-- Main card with glassmorphism effect -->
          <div class="backdrop-blur-xl bg-white/90 rounded-3xl shadow-2xl border border-white/20 p-8 animate-fade-in">
            <div class="text-center mb-8">
              <!-- Animated logo -->
              <div class="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-pulse-slow">
                <i class="fas fa-user-plus text-white text-3xl"></i>
              </div>
              <h1 class="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">Create Account</h1>
              <p class="text-gray-600 text-lg">Join FreshCart today</p>
            </div>

            <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-6">
              <div class="space-y-2">
                <label class="block text-sm font-semibold text-gray-700">Full Name</label>
                <div class="relative group">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <i class="fas fa-user text-gray-400 group-focus-within:text-emerald-500 transition-colors"></i>
                  </div>
                  <input type="text" formControlName="name"
                         class="input-modern pl-11 peer" placeholder="John Doe">
                  <div class="absolute inset-y-0 right-0 pr-4 flex items-center opacity-0 peer-focus-within:opacity-100 transition-opacity">
                    <i class="fas fa-check-circle text-emerald-500" *ngIf="registerForm.get('name')?.valid && registerForm.get('name')?.touched"></i>
                  </div>
                </div>
                @if (registerForm.get('name')?.invalid && registerForm.get('name')?.touched) {
                  <div class="flex items-center gap-2 text-red-500 text-sm animate-slide-in-left">
                    <i class="fas fa-exclamation-triangle text-xs"></i>
                    <span>Name is required</span>
                  </div>
                }
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-semibold text-gray-700">Email Address</label>
                <div class="relative group">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <i class="fas fa-envelope text-gray-400 group-focus-within:text-emerald-500 transition-colors"></i>
                  </div>
                  <input type="email" formControlName="email"
                         class="input-modern pl-11 peer" placeholder="you@example.com">
                  <div class="absolute inset-y-0 right-0 pr-4 flex items-center opacity-0 peer-focus-within:opacity-100 transition-opacity">
                    <i class="fas fa-check-circle text-emerald-500" *ngIf="registerForm.get('email')?.valid && registerForm.get('email')?.touched"></i>
                  </div>
                </div>
                @if (registerForm.get('email')?.invalid && registerForm.get('email')?.touched) {
                  <div class="flex items-center gap-2 text-red-500 text-sm animate-slide-in-left">
                    <i class="fas fa-exclamation-triangle text-xs"></i>
                    <span>Please enter a valid email address</span>
                  </div>
                }
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-semibold text-gray-700">Phone Number <span class="text-gray-400 font-normal">(Optional)</span></label>
                <div class="relative group">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <i class="fas fa-phone text-gray-400 group-focus-within:text-emerald-500 transition-colors"></i>
                  </div>
                  <input type="tel" formControlName="phone"
                         class="input-modern pl-11" placeholder="+1 (555) 123-4567">
                </div>
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-semibold text-gray-700">Password</label>
                <div class="relative group">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <i class="fas fa-lock text-gray-400 group-focus-within:text-emerald-500 transition-colors"></i>
                  </div>
                  <input [type]="showPassword ? 'text' : 'password'" formControlName="password"
                         class="input-modern pl-11 pr-11 peer" placeholder="Create a strong password">
                  <button type="button" (click)="showPassword = !showPassword"
                          class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-emerald-500 transition-colors">
                    <i class="fas" [class.fa-eye]="!showPassword" [class.fa-eye-slash]="showPassword"></i>
                  </button>
                </div>
                @if (registerForm.get('password')?.invalid && registerForm.get('password')?.touched) {
                  <div class="flex items-center gap-2 text-red-500 text-sm animate-slide-in-left">
                    <i class="fas fa-exclamation-triangle text-xs"></i>
                    <span>Password must be at least 6 characters</span>
                  </div>
                }
                @if (registerForm.get('password')?.valid && registerForm.get('password')?.touched) {
                  <div class="flex items-center gap-2 text-emerald-600 text-sm animate-slide-in-left">
                    <i class="fas fa-check-circle text-xs"></i>
                    <span>Strong password</span>
                  </div>
                }
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-semibold text-gray-700">Confirm Password</label>
                <div class="relative group">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <i class="fas fa-lock text-gray-400 group-focus-within:text-emerald-500 transition-colors"></i>
                  </div>
                  <input type="password" formControlName="confirmPassword"
                         class="input-modern pl-11 peer" placeholder="Confirm your password">
                  <div class="absolute inset-y-0 right-0 pr-4 flex items-center opacity-0 peer-focus-within:opacity-100 transition-opacity">
                    <i class="fas fa-check-circle text-emerald-500" *ngIf="!registerForm.errors?.['mismatch'] && registerForm.get('confirmPassword')?.touched && registerForm.get('confirmPassword')?.value"></i>
                    <i class="fas fa-times-circle text-red-500" *ngIf="registerForm.errors?.['mismatch'] && registerForm.get('confirmPassword')?.touched"></i>
                  </div>
                </div>
                @if (registerForm.errors?.['mismatch'] && registerForm.get('confirmPassword')?.touched) {
                  <div class="flex items-center gap-2 text-red-500 text-sm animate-slide-in-left">
                    <i class="fas fa-exclamation-triangle text-xs"></i>
                    <span>Passwords do not match</span>
                  </div>
                }
              </div>

              @if (errorMessage) {
                <div class="bg-red-50/80 backdrop-blur border border-red-200/50 rounded-xl p-4 flex items-center gap-3 animate-slide-in-left">
                  <div class="flex-shrink-0">
                    <i class="fas fa-exclamation-circle text-red-500 text-lg"></i>
                  </div>
                  <div class="flex-1">
                    <p class="text-red-700 font-medium text-sm">{{ errorMessage }}</p>
                  </div>
                </div>
              }

              <button type="submit" [disabled]="registerForm.invalid || isLoading"
                      class="w-full btn-modern-primary py-4 flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed">
                @if (isLoading) {
                  <i class="fas fa-spinner fa-spin text-lg"></i>
                  <span class="font-semibold">Creating account...</span>
                } @else {
                  <span class="font-semibold">Create Account</span>
                  <i class="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                }
              </button>
            </form>

            <div class="mt-8 text-center space-y-4">
              <div class="relative">
                <div class="absolute inset-0 flex items-center">
                  <div class="w-full border-t border-gray-200"></div>
                </div>
                <div class="relative flex justify-center text-sm">
                  <span class="px-4 bg-white/90 backdrop-blur text-gray-500">Already have an account?</span>
                </div>
              </div>
              <a routerLink="/login" class="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700 transition-colors group">
                <span>Sign in instead</span>
                <i class="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    const { name, email, password, phone } = this.registerForm.value;

    this.authService.register(name, email, password, phone).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
      }
    });
  }
}
