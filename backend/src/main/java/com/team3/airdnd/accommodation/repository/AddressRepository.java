package com.team3.airdnd.accommodation.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.team3.airdnd.accommodation.domain.Address;

public interface AddressRepository extends JpaRepository<Address, Long> {
}
