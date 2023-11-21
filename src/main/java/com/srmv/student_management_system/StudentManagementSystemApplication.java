package com.srmv.student_management_system;

import com.srmv.student_management_system.entities.UserRole;
import com.srmv.student_management_system.entities.User;
import com.srmv.student_management_system.repositories.UserRepository;
import com.srmv.student_management_system.repositories.UserRoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@SpringBootApplication
@RestController
public class StudentManagementSystemApplication {

	@Autowired
	private BCryptPasswordEncoder bCryptPasswordEncoder;

	@Autowired
	private UserRoleRepository userRoleRepository;

	@Autowired
	private UserRepository userRepository;

	public static void main(String[] args) {

		SpringApplication.run(StudentManagementSystemApplication.class, args);
	}

	@GetMapping(value = "/createadmin")
	public String adminCreation(){

//		check if there is an admin account already
		User existAdmin = userRepository.findUserByUsername("admin");

		if (existAdmin == null) {
			User adminUser = new User();
			adminUser.setUsername("admin");
			adminUser.setPassword(bCryptPasswordEncoder.encode("12345"));
			adminUser.setEmail("adminsrmv@gmail.com");
			adminUser.setUser_status(true);
			adminUser.setAdded_date(LocalDateTime.now());
			Set<UserRole> roles = new HashSet<>();
			roles.add(userRoleRepository.getReferenceById(1));

			adminUser.setRoles(roles);

			userRepository.save(adminUser);
		}

		return "<script>window.location.replace('/login')</script>";
	}

}
