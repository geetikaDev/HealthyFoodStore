import {
  Component,
  inject,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth-service';


// =====================================================
// MSG91 WINDOW DECLARATION
// =====================================================

declare global {

  interface Window {

    initSendOTP: (configuration: any) => void;

    sendOtp?: (
      identifier: string,
      success?: (data: any) => void,
      failure?: (error: any) => void
    ) => void;

    verifyOtp?: (
      otp: string | number,
      success?: (data: any) => void,
      failure?: (error: any) => void,
      reqId?: string
    ) => void;

    retryOtp?: (
      channel: string | null,
      success?: (data: any) => void,
      failure?: (error: any) => void,
      reqId?: string
    ) => void;

    getWidgetData?: () => any;

    isCaptchaVerified?: () => boolean;
  }
}


@Component({

  selector: 'app-login',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],

  templateUrl: './login.html',

  styleUrl: './login.css'

})


export class Login implements OnInit {


  private authService = inject(AuthService);

  private router = inject(Router);

  private cdr = inject(ChangeDetectorRef);


  // =====================================================
  // EMAIL LOGIN
  // =====================================================

  email = '';

  password = '';


  // =====================================================
  // PHONE OTP LOGIN
  // =====================================================

  phone = '';

  otp = '';


  // =====================================================
  // MSG91
  // =====================================================

  private msg91WidgetId = '36684169544b373030393534';

  private msg91TokenAuth = '564947TbaZnnJHm6a900a74P1';


  /*
   * MSG91 request / transaction ID.
   *
   * MSG91 may return this from sendOtp().
   * We keep it so retryOtp() and verifyOtp()
   * can use it when required.
   */

  private msg91ReqId = '';


  // =====================================================
  // LOGIN MODE
  // =====================================================

  loginMode: 'email' | 'phone' = 'email';


  // =====================================================
  // PHONE OTP STEP
  //
  // 1 = phone number
  // 2 = OTP
  // =====================================================

  phoneStep = 1;


  // =====================================================
  // LOADING
  // =====================================================

  loading = false;


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {


    if (sessionStorage.getItem('token')) {

      this.router.navigate(['/home']);

      return;

    }


    /*
     * Load MSG91 OTP Widget
     */

    this.loadMsg91Widget();

  }


  // =====================================================
  // LOAD MSG91 OTP WIDGET
  // =====================================================

  private loadMsg91Widget(): void {


    const configuration = {


      widgetId: this.msg91WidgetId,

      tokenAuth: this.msg91TokenAuth,

      identifier: '',

      exposeMethods: true,


      // =================================================
      // MSG91 VERIFY SUCCESS
      // =================================================

      success: (data: any) => {


        console.log(
          'MSG91 OTP verification success:',
          data
        );


        /*
         * MSG91 has successfully verified
         * the OTP.
         */

        this.handleMsg91Success(data);

      },


      // =================================================
      // MSG91 VERIFY FAILURE
      // =================================================

      failure: (error: any) => {


        console.error(
          'MSG91 OTP verification failed:',
          error
        );


        this.loading = false;


        alert(
          'OTP verification failed. Please try again.'
        );


        this.cdr.detectChanges();

      }

    };


    /*
     * MSG91 official provider URLs
     */

    const urls = [

      'https://verify.msg91.com/otp-provider.js',

      'https://verify.phone91.com/otp-provider.js'

    ];


    let index = 0;


    const attemptLoad = () => {


      if (index >= urls.length) {


        console.error(
          'Unable to load MSG91 OTP Widget.'
        );


        return;

      }


      const script =
        document.createElement('script');


      script.src = urls[index];

      script.async = true;


      script.onload = () => {


        console.log(
          'MSG91 OTP script loaded.'
        );


        if (
          typeof window.initSendOTP ===
          'function'
        ) {


          window.initSendOTP(
            configuration
          );


          console.log(
            'MSG91 OTP Widget initialized.'
          );


        } else {


          console.error(
            'MSG91 initSendOTP is not available.'
          );

        }

      };


      script.onerror = () => {


        console.warn(
          'MSG91 provider failed:',
          urls[index]
        );


        index++;

        attemptLoad();

      };


      document.head.appendChild(script);

    };


    attemptLoad();

  }


  // =====================================================
  // NORMAL EMAIL LOGIN
  // =====================================================

  login(): void {


    if (!this.email || !this.password) {


      alert(
        'Please enter email and password.'
      );


      return;

    }


    this.loading = true;


    const credentials = {

      email: this.email,

      password: this.password

    };


    this.authService
      .login(credentials)
      .subscribe({


        next: (response: any) => {


          console.log(
            'Login response:',
            response
          );


          sessionStorage.setItem(
            'token',
            response.token
          );


          sessionStorage.setItem(

            'user',

            JSON.stringify({

              userId: response.userId,

              firstName: response.firstName,

              lastName: response.lastName,

              email: response.email

            })

          );


          this.loading = false;


          alert(
            response.message
          );


          this.router
            .navigate(['/home'])
            .then(() => {

              window.location.reload();

            });

        },


        error: (error) => {


          console.error(
            'Login error:',
            error
          );


          this.loading = false;


          alert(
            error.error ||
            'Invalid Email or Password'
          );

        }

      });

  }


  // =====================================================
  // SEND PHONE OTP
  // =====================================================

  sendPhoneOtp(): void {


    if (!this.phone) {


      alert(
        'Please enter your phone number.'
      );


      return;

    }


    if (
      !/^[6-9]\d{9}$/.test(
        this.phone
      )
    ) {


      alert(
        'Please enter a valid 10-digit Indian mobile number.'
      );


      return;

    }


    this.loading = true;


    /*
     * Convert Indian number to international format.
     *
     * Example:
     *
     * 9876543210
     *
     * becomes:
     *
     * 919876543210
     */

    const identifier =
      '91' + this.phone;


    console.log(
      'Starting MSG91 OTP:',
      identifier
    );


    /*
     * Check whether MSG91 sendOtp()
     * is available.
     */

    if (
      typeof window.sendOtp !==
      'function'
    ) {


      console.error(
        'MSG91 sendOtp method is not available.'
      );


      this.loading = false;


      alert(
        'OTP service is not ready. Please refresh the page and try again.'
      );


      return;

    }


    try {


      /*
       * IMPORTANT:
       *
       * MSG91 sendOtp() accepts:
       *
       * 1. identifier
       * 2. success callback
       * 3. failure callback
       */

      window.sendOtp(

        identifier,


        // =============================================
        // SEND OTP SUCCESS
        // =============================================

        (data: any) => {


          console.log(
            'MSG91 OTP sent successfully:',
            data
          );


          /*
           * Try to capture request ID returned
           * by MSG91.
           *
           * Different widget responses can use
           * different property names, so we check
           * the commonly returned fields.
           */

          this.msg91ReqId =
      data?.message || '';

    this.phoneStep = 2;

    this.loading = false;

    this.cdr.detectChanges();

        },


        // =============================================
        // SEND OTP FAILURE
        // =============================================

        (error: any) => {


          console.error(
            'MSG91 send OTP failed:',
            error
          );


          this.loading = false;


          alert(
            'Unable to send OTP. Please try again.'
          );


          this.cdr.detectChanges();

        }

      );


    } catch (error) {


      console.error(
        'MSG91 send OTP error:',
        error
      );


      this.loading = false;


      alert(
        'Unable to send OTP. Please try again.'
      );

    }

  }


  // =====================================================
  // VERIFY PHONE OTP
  // =====================================================

  verifyPhoneOtp(): void {


    if (!this.otp) {


      alert(
        'Please enter the OTP.'
      );


      return;

    }


    if (
      !/^\d{6}$/.test(
        this.otp
      )
    ) {


      alert(
        'Please enter a valid 6-digit OTP.'
      );


      return;

    }


    this.loading = true;


    console.log(
      'Verifying MSG91 OTP:',
      this.otp
    );


    /*
     * Check MSG91 verifyOtp()
     */

    if (
      typeof window.verifyOtp !==
      'function'
    ) {


      console.error(
        'MSG91 verifyOtp method is not available.'
      );


      this.loading = false;


      alert(
        'OTP verification service is not ready. Please refresh the page.'
      );


      return;

    }


    try {


      /*
       * MSG91 official method:
       *
       * verifyOtp(
       *    otp,
       *    success callback,
       *    failure callback,
       *    reqId
       * )
       */

      window.verifyOtp(

        this.otp,


        // =============================================
        // VERIFY SUCCESS
        // =============================================

        (data: any) => {


          console.log(
            'OTP verified:',
            data
          );


          this.handleMsg91Success(data);

        },


        // =============================================
        // VERIFY FAILURE
        // =============================================

        (error: any) => {


          console.error(
            'OTP verification error:',
            error
          );


          this.loading = false;


          alert(
            'Invalid OTP. Please try again.'
          );


          this.cdr.detectChanges();

        },


        /*
         * Send request ID if MSG91 provided one.
         *
         * If empty, MSG91 can handle the request
         * according to the widget configuration.
         */

        this.msg91ReqId

      );


    } catch (error) {


      console.error(
        'MSG91 verify OTP error:',
        error
      );


      this.loading = false;


      alert(
        'Unable to verify OTP.'
      );

    }

  }


  // =====================================================
  // RESEND / RETRY OTP
  // =====================================================

  retryPhoneOtp(): void {


    /*
     * Check whether retryOtp() is available.
     */

    if (
      typeof window.retryOtp !==
      'function'
    ) {


      console.error(
        'MSG91 retryOtp method is not available.'
      );


      alert(
        'Resend OTP service is not ready. Please refresh the page.'
      );


      return;

    }


    this.loading = true;


    console.log(
      'Retrying MSG91 OTP'
    );


    try {


      /*
       * According to MSG91 documentation:
       *
       * retryOtp(
       *    null,
       *    success callback,
       *    failure callback,
       *    reqId
       * )
       *
       * null means use the default channel.
       */

      window.retryOtp(

        null,


        // =============================================
        // RETRY SUCCESS
        // =============================================

        (data: any) => {


          console.log(
            'MSG91 resend data:',
            data
          );


          /*
           * Update request ID if MSG91
           * returns a new one.
           */

          if (data) {

            this.msg91ReqId =
              data.reqId ||
              data.requestId ||
              data.transactionId ||
              data.req_id ||
              this.msg91ReqId;

          }


          this.loading = false;


          this.otp = '';


          this.cdr.detectChanges();


          alert(
            'OTP resent successfully.'
          );

        },


        // =============================================
        // RETRY FAILURE
        // =============================================

        (error: any) => {


          console.error(
            'MSG91 resend OTP failed:',
            error
          );


          this.loading = false;


          alert(
            'Unable to resend OTP. Please try again.'
          );


          this.cdr.detectChanges();

        },


        /*
         * Request / transaction ID.
         */

        this.msg91ReqId || undefined

      );


    } catch (error) {


      console.error(
        'MSG91 retry OTP error:',
        error
      );


      this.loading = false;


      alert(
        'Unable to resend OTP.'
      );

    }

  }


  // =====================================================
  // MSG91 SUCCESS
  // =====================================================

  private handleMsg91Success(data: any): void {

  console.log(
    'MSG91 verified response:',
    data
  );

  this.loading = true;

  const request = {

    phone: this.phone,

    otp: this.otp

  };

  this.authService
    .verifyLoginOtp(request)
    .subscribe({

      next: (response: any) => {

        console.log(
          'Phone login backend response:',
          response
        );

        sessionStorage.setItem(
          'token',
          response.token
        );

        sessionStorage.setItem(
          'user',
          JSON.stringify({

            userId: response.userId,

            firstName: response.firstName,

            lastName: response.lastName,

            email: response.email

          })
        );

        this.loading = false;

        alert(
          response.message ||
          'Login Successful'
        );

        this.router
          .navigate(['/home'])
          .then(() => {

            window.location.reload();

          });

      },

      error: (error) => {

        console.error(
          'Phone login backend error:',
          error
        );

        this.loading = false;

        alert(
          error?.error?.message ||
          error?.error ||
          'Phone login failed.'
        );

        this.cdr.detectChanges();

      }

    });

}

  // =====================================================
  // CHECK CAPTCHA STATUS
  // =====================================================

  checkCaptchaStatus(): boolean {


    if (
      typeof window.isCaptchaVerified !==
      'function'
    ) {


      console.warn(
        'MSG91 isCaptchaVerified() is not available.'
      );


      return false;

    }


    const isVerified =
      window.isCaptchaVerified();


    console.log(
      'Captcha is verified or not:',
      isVerified
    );


    return isVerified;

  }


  // =====================================================
  // SWITCH TO PHONE LOGIN
  // =====================================================

  showPhoneLogin(): void {


    this.loginMode = 'phone';


    this.phoneStep = 1;


    this.phone = '';

    this.otp = '';

    this.msg91ReqId = '';

    this.loading = false;

  }


  // =====================================================
  // SWITCH BACK TO EMAIL LOGIN
  // =====================================================

  showEmailLogin(): void {


    this.loginMode = 'email';


    this.phoneStep = 1;


    this.phone = '';

    this.otp = '';

    this.msg91ReqId = '';

    this.loading = false;

  }

}
