import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService, User } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

      @if (message()) {
        <div class="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6 flex items-center gap-2"
             [class.bg-red-50]="isError()" [class.border-red-200]="isError()">
          <i class="fas fa-check-circle text-emerald-600" [class.text-red-600]="isError()"></i>
          <p [class.text-emerald-700]="!isError()" [class.text-red-700]="isError()">{{ message() }}</p>
        </div>
      }

      <div class="grid md:grid-cols-3 gap-8">
        <!-- Profile Card -->
        <div class="md:col-span-1">
          <div class="card p-6 text-center">
            <div class="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-user text-emerald-600 text-3xl"></i>
            </div>
            <h2 class="text-xl font-bold text-gray-900">{{ user()?.name }}</h2>
            <p class="text-gray-500">{{ user()?.email }}</p>
            <p class="text-sm text-emerald-600 mt-2 font-medium capitalize">{{ user()?.role }}</p>
          </div>
        </div>

        <!-- Edit Form -->
        <div class="md:col-span-2">
          <div class="card p-6">
            <h3 class="text-xl font-bold text-gray-900 mb-6">Edit Profile</h3>
            <form [formGroup]="profileForm" (ngSubmit)="updateProfile()" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input type="text" formControlName="name" class="input-field">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input type="tel" formControlName="phone" class="input-field">
              </div>
              <div class="border-t border-gray-100 pt-4 mt-4">
                <h4 class="font-semibold text-gray-900 mb-4">Address</h4>
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Street</label>
                    <input type="text" formControlName="street" class="input-field">
                  </div>
                  <div class="grid md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">City</label>
                      <input type="text" formControlName="city" class="input-field">
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">State</label>
                      <input type="text" formControlName="state" class="input-field">
                    </div>
                  </div>
                  <div class="grid md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                      <input type="text" formControlName="zipCode" class="input-field">
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Country</label>
                      <input type="text" formControlName="country" class="input-field">
                    </div>
                  </div>
                </div>
              </div>
              <div class="pt-4">
                <button type="submit" [disabled]="profileForm.invalid || isLoading()"
                        class="btn-primary w-full md:w-auto disabled:opacity-50">
                  @if (isLoading()) {
                    <i class="fas fa-spinner fa-spin mr-2"></i>Saving...
                  } @else {
                    <span>Save Changes</span>
                  }
                </button>
              </div>
            </form>
          </div>

          <!-- Change Password -->
          <div class="card p-6 mt-6">
            <h3 class="text-xl font-bold text-gray-900 mb-6">Change Password</h3>
            <form [formGroup]="passwordForm" (ngSubmit)="changePassword()" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <input type="password" formControlName="currentPassword" class="input-field">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <input type="password" formControlName="newPassword" class="input-field">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                <input type="password" formControlName="confirmPassword" class="input-field">
                @if (passwordForm.errors?.['mismatch'] && passwordForm.get('confirmPassword')?.touched) {
                  <p class="text-red-500 text-sm mt-1">Passwords do not match</p>
                }
              </div>
              <div class="pt-4">
                <button type="submit" [disabled]="passwordForm.invalid || isLoadingPassword()"
                        class="btn-primary w-full md:w-auto disabled:opacity-50">
                  @if (isLoadingPassword()) {
                    <i class="fas fa-spinner fa-spin mr-2"></i>Changing...
                  } @else {
                    <span>Change Password</span>
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  user = signal<User | null>(null);
  profileForm: FormGroup;
  passwordForm: FormGroup;
  isLoading = signal(false);
  isLoadingPassword = signal(false);
  message = signal('');
  isError = signal(false);

  constructor(private fb: FormBuilder, private authService: AuthService, private http: HttpClient) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      phone: [''],
      street: [''],
      city: [''],
      state: [''],
      zipCode: [''],
      country: ['']
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    // First try to get user from localStorage for immediate display
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.user.set(user);
        this.prefillForm();
      } catch (error) {
        console.error('Error parsing stored user data:', error);
      }
    }
    
    // Then refresh with fresh data from backend
    this.refreshUserData();
  }

  refreshUserData(): void {
    // Get fresh user data from backend to ensure we have the latest profile info
    this.http.get<{ user: User }>(`http://localhost:5000/api/auth/profile`).subscribe({
      next: (response) => {
        if (response.user) {
          this.user.set(response.user);
          // Update localStorage with fresh data
          localStorage.setItem('user', JSON.stringify(response.user));
          this.prefillForm();
        }
      },
      error: () => {
        // If refresh fails, use existing data
        this.prefillForm();
      }
    });
  }

  prefillForm(): void {
    const u = this.user();
    if (u) {
      this.profileForm.patchValue({
        name: u.name || '',
        phone: u.phone || '',
        street: u.address?.street || '',
        city: u.address?.city || '',
        state: u.address?.state || '',
        zipCode: u.address?.zipCode || '',
        country: u.address?.country || ''
      });
    }
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  updateProfile(): void {
    if (this.profileForm.invalid) return;

    this.isLoading.set(true);
    
    // Structure the data properly for the backend
    const formValue = this.profileForm.value;
    const updateData = {
      name: formValue.name,
      phone: formValue.phone,
      address: {
        street: formValue.street,
        city: formValue.city,
        state: formValue.state,
        zipCode: formValue.zipCode,
        country: formValue.country
      }
    };

    this.authService.updateProfile(updateData).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.message.set('Profile updated successfully!');
        this.isError.set(false);
        // Update the user signal with the new data from backend
        this.user.set(response.user);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.message.set(err.error?.message || 'Failed to update profile');
        this.isError.set(true);
      }
    });
  }

  changePassword(): void {
    if (this.passwordForm.invalid) return;

    this.isLoadingPassword.set(true);
    const { currentPassword, newPassword } = this.passwordForm.value;
    
    this.authService.changePassword(currentPassword, newPassword).subscribe({
      next: () => {
        this.isLoadingPassword.set(false);
        this.passwordForm.reset();
        this.message.set('Password changed successfully!');
        this.isError.set(false);
      },
      error: (err) => {
        this.isLoadingPassword.set(false);
        this.message.set(err.error?.message || 'Failed to change password');
        this.isError.set(true);
      }
    });
  }
}
