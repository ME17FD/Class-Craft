package com.ClassCraft.site.security;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
class JwtProviderTest {

    @InjectMocks
    private JwtProvider jwtProvider;

    private static final String TEST_SECRET = "testSecretKey123456789012345678901234567890123456789012345678901234567890";
    private static final String TEST_EMAIL = "test@example.com";
    private static final String TEST_PASSWORD = "password";

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(jwtProvider, "jwtSecret", TEST_SECRET);
    }

    @Test
    void generateToken_ShouldGenerateValidToken() {
        // Create test authentication
        UserDetails userDetails = new User(TEST_EMAIL, TEST_PASSWORD, Collections.emptyList());
        Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null);

        // Generate token
        String token = jwtProvider.generateToken(authentication);

        // Verify token
        assertNotNull(token);
        assertTrue(jwtProvider.validateToken(token));
    }

    @Test
    void validateToken_WithValidToken_ShouldReturnTrue() {
        // Create test authentication
        UserDetails userDetails = new User(TEST_EMAIL, TEST_PASSWORD, Collections.emptyList());
        Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null);

        // Generate token
        String token = jwtProvider.generateToken(authentication);

        // Validate token
        boolean isValid = jwtProvider.validateToken(token);

        assertTrue(isValid);
    }

    @Test
    void validateToken_WithInvalidToken_ShouldReturnFalse() {
        String invalidToken = "invalid.token.here";

        boolean isValid = jwtProvider.validateToken(invalidToken);

        assertFalse(isValid);
    }

    @Test
    void validateToken_WithExpiredToken_ShouldReturnFalse() {
        // Create test authentication
        UserDetails userDetails = new User(TEST_EMAIL, TEST_PASSWORD, Collections.emptyList());
        Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null);

        // Generate token with past expiration
        String token = jwtProvider.generateToken(authentication);
        
        // Set token expiration to past
        ReflectionTestUtils.setField(jwtProvider, "jwtExpiration", -1L);

        boolean isValid = jwtProvider.validateToken(token);

        assertFalse(isValid);
    }

    @Test
    void validateToken_WithMalformedToken_ShouldReturnFalse() {
        String malformedToken = "not.a.valid.jwt.token";

        boolean isValid = jwtProvider.validateToken(malformedToken);

        assertFalse(isValid);
    }

    @Test
    void validateToken_WithEmptyToken_ShouldReturnFalse() {
        String emptyToken = "";

        boolean isValid = jwtProvider.validateToken(emptyToken);

        assertFalse(isValid);
    }

    @Test
    void validateToken_WithNullToken_ShouldReturnFalse() {
        boolean isValid = jwtProvider.validateToken(null);

        assertFalse(isValid);
    }

    @Test
    void getEmailFromJwt_ShouldReturnEmail() {
        // Create test authentication
        UserDetails userDetails = new User(TEST_EMAIL, TEST_PASSWORD, Collections.emptyList());
        Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null);

        // Generate token
        String token = jwtProvider.generateToken(authentication);

        // Get email from token
        String email = jwtProvider.getEmailFromJwt(token);

        assertEquals(TEST_EMAIL, email);
    }
} 