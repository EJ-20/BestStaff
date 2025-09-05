package com.beststaff.bootstrap;

import com.beststaff.model.Employee;
import com.beststaff.repository.EmployeeRepository;
import com.beststaff.model.Badge;
import com.beststaff.repository.BadgeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import lombok.RequiredArgsConstructor;

import java.util.List;

@Component
@Profile("dev")
@RequiredArgsConstructor
public class DevDataSeeder implements CommandLineRunner {

    private final EmployeeRepository employeeRepository;
    private final BadgeRepository badgeRepository;

    // TEMP: seed on startup so we can verify end-to-end
    
    CommandLineRunner seed(EmployeeRepository employees, BadgeRepository badges) {
        return args -> {
            System.out.println("=== Dev seeder starting ===");

            if (employees.count() == 0) {
                Employee e1 = new Employee();
                e1.setName("Alice Johnson");
                e1.setEmail("alice@example.com");
                e1.setPoints(120);

                Employee e2 = new Employee();
                e2.setName("Bob Smith");
                e2.setEmail("bob@example.com");
                e2.setPoints(85);

                Employee e3 = new Employee();
                e3.setName("Charlie Kim");
                e3.setEmail("charlie@example.com");
                e3.setPoints(200);

                employees.save(e1);
                employees.save(e2);
                employees.save(e3);
                System.out.println("Seeded Employees: 3");
            } else {
                System.out.println("Employees already present: " + employees.count());
            }

            if (badges.count() == 0) {
                Badge b1 = new Badge();
                b1.setName("Teamwork Star");
                b1.setPointValue(25);
                b1.setDescription("For outstanding collaboration");

                Badge b2 = new Badge();
                b2.setName("Innovation Guru");
                b2.setPointValue(50);
                b2.setDescription("For introducing creative solutions");

                Badge b3 = new Badge();
                b3.setName("Customer Hero");
                b3.setPointValue(30);
                b3.setDescription("For excellent customer service");

                badges.save(b1);
                badges.save(b2);
                badges.save(b3);
                System.out.println("Seeded Badges: 3");
            } else {
                System.out.println("Badges already present: " + badges.count());
            }

            System.out.println("=== Dev seeder done ===");
        };
    }

    @Override
    public void run(String... args) {
        if (employeeRepository.count() == 0) {
            Employee alice = new Employee();
            alice.setName("Alice Johnson");
            alice.setEmail("alice@example.com");
            alice.setPoints(120);
            
            Employee bob = new Employee();
            bob.setName("Bob Smith");
            bob.setEmail("bob@example.com");
            bob.setPoints(85);
            
            Employee charlie = new Employee();
            charlie.setName("Charlie Kim");
            charlie.setEmail("charlie@example.com");
            charlie.setPoints(200);
            
            employeeRepository.saveAll(List.of(alice, bob, charlie));
        }

        if (badgeRepository.count() == 0) {
            Badge teamwork = new Badge();
            teamwork.setName("Teamwork Star");
            teamwork.setDescription("For outstanding collaboration");
            teamwork.setPointValue(25);
            
            Badge innovation = new Badge();
            innovation.setName("Innovation Guru");
            innovation.setDescription("For introducing creative solutions");
            innovation.setPointValue(50);
            
            Badge customer = new Badge();
            customer.setName("Customer Hero");
            customer.setDescription("For excellent customer service");
            customer.setPointValue(30);
            
            badgeRepository.saveAll(List.of(teamwork, innovation, customer));
        }
    }
}
