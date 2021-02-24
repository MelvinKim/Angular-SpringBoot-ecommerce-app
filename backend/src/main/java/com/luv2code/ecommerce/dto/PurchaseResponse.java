package com.luv2code.ecommerce.dto;

import lombok.Data;

@Data
public class PurchaseResponse {

    private final String orderTrackingNumber;

    //lombok @Data will generate a constructor but it will only do it for "final" fields => Don't forget to add "final" Melvin
}
