import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { booking } from 'src/app/classes/booking';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { BookingService } from 'src/app/service/booking.service';


@Component({
  selector: 'app-ground',
  templateUrl: './ground.component.html',
 
  styleUrls: ['./ground.component.scss']
})
export class GroundComponent implements OnInit {
  
  bookGroundForm: FormGroup =new FormGroup({
    fromDate:new FormControl(''),
    toDate:new FormControl(''),
    numberOfPersons:new FormControl(''),
    description:new FormControl('')
  })
  groundId!:number;
  email!:string;
  
  
  
  
  constructor(private router:Router,private service:BookingService,private formBuilder: FormBuilder, private route:ActivatedRoute,private auth:AuthServiceService) { 
  
  }
  

  bookings=new booking();
  ngOnInit(): void {
    this.groundId=this.route.snapshot.params['groundId'];
  this.bookGroundForm = this.formBuilder.group({


    fromDate: [
      '', 
      [Validators.required, 
       
      ]
    ],
    toDate: [
      '', 
      [Validators.required]
    ],
    numberOfPersons: [
      '',
      [
        Validators.required,
      ]
    ],
    description: [
      '',
      [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(40)
      ]
    ]
  })
  }
  
  handleGround(){
  
  this.service.saveBooking(this.bookings,this.auth.user.email,this.groundId).subscribe({
    next:data=>{
      console.log(data)
      alert("Ground Booked Successfully")
      this.router.navigate(['/user/dashboard']);
    },
   error: err=>{
      console.log(err)
      alert(err)
    }
  });
  }

  paymentRequest:google.payments.api.PaymentDataRequest={
apiVersion:2,
apiVersionMinor:0,
allowedPaymentMethods:[
  {
    type:'CARD',
    parameters:{
      allowedAuthMethods:['PAN_ONLY','CRYPTOGRAM_3DS'],
      allowedCardNetworks:['AMEX','VISA','MASTERCARD']
    },

    tokenizationSpecification: {
      type:'PAYMENT_GATEWAY',
      parameters:{
      gateway:'example',
      gatewayMerchantId:'exampleGatewayMerchantId'
      }
    }
  }
],
merchantInfo:{
  merchantId:'123',
  merchantName:'demo', 
},
transactionInfo:{
  totalPriceStatus:'FINAL',
  totalPriceLabel:'Total',
  totalPrice:'0.10',
  currencyCode:'INR',
  countryCode:'IN'

},
callbackIntents:['PAYMENT_AUTHORIZATION']
  };


  onLoadPaymentData=(
    event:Event
  ): void => {
    const eventDetail =event as CustomEvent<google.payments.api.PaymentData>;
    console.log('load paymnet data',eventDetail.detail);
  }

  onPaymentDataAuthorized:google.payments.api.PaymentAuthorizedHandler=(
paymentData
  )=>{
    console.log('payment authorized',paymentData);
    this.handleGround();
    return {
      transactionState: 'SUCCESS'
    };
  }

  onError=(event: ErrorEvent):void =>{
    console.error('error',event.error);
  }


}
