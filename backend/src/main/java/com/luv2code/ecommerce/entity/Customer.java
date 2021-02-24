package com.luv2code.ecommerce.entity;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "customer")
@Getter
@Setter
//@Data
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "email")
    private String email;

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL)
    private Set<Order> orders = new HashSet<>();

    //add a method to add orders to a Customer
    public void add(Order order) {
        //check if passed order is not equal to null
        if(order != null) {
            //check if the orders collection is null, then create a new Hashset
            if(orders == null ) {
                orders = new HashSet<>();
            }

            //else insert into the orders collection
            orders.add(order);
            order.setCustomer(this);
        }
    }

}
