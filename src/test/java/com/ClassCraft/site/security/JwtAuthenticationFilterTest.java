package com.ClassCraft.site.security;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.io.IOException;
import java.util.Collections;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

@ExtendWith(MockitoExtension.class)
class JwtAuthenticationFilterTest {

    @Mock
    private JwtProvider jwtProvider;

    @Mock
    private UserDetailsService userDetailsService;

    @InjectMocks
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    private MockHttpServletRequest request;
    private MockHttpServletResponse response;
    private FilterChain filterChain;
    private static final String TEST_TOKEN = "test.jwt.token";
    private static final String TEST_USERNAME = "testuser";

    @BeforeEach
    void setUp() {
        request = new MockHttpServletRequest();
        response = new MockHttpServletResponse();
        filterChain = mock(FilterChain.class);
        SecurityContextHolder.clearContext();
    }

    @Test
    void doFilterInternal_WithValidToken_ShouldAuthenticateUser() throws ServletException, IOException {
        // Setup
        request.addHeader("Authorization", "Bearer " + TEST_TOKEN);
        UserDetails userDetails = new User(TEST_USERNAME, "password", Collections.emptyList());
        
        when(jwtProvider.validateToken(TEST_TOKEN)).thenReturn(true);
        when(jwtProvider.getEmailFromJwt(TEST_TOKEN)).thenReturn(TEST_USERNAME);
        when(userDetailsService.loadUserByUsername(TEST_USERNAME)).thenReturn(userDetails);

        // Execute
        jwtAuthenticationFilter.doFilterInternal(request, response, filterChain);

        // Verify
        verify(filterChain, times(1)).doFilter(request, response);
        assertNotNull(SecurityContextHolder.getContext().getAuthentication());
        assertEquals(TEST_USERNAME, SecurityContextHolder.getContext().getAuthentication().getName());
    }

    @Test
    void doFilterInternal_WithInvalidToken_ShouldNotAuthenticateUser() throws ServletException, IOException {
        // Setup
        request.addHeader("Authorization", "Bearer " + TEST_TOKEN);
        when(jwtProvider.validateToken(TEST_TOKEN)).thenReturn(false);

        // Execute
        jwtAuthenticationFilter.doFilterInternal(request, response, filterChain);

        // Verify
        verify(filterChain, times(1)).doFilter(request, response);
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }

    @Test
    void doFilterInternal_WithNoToken_ShouldNotAuthenticateUser() throws ServletException, IOException {
        // Execute
        jwtAuthenticationFilter.doFilterInternal(request, response, filterChain);

        // Verify
        verify(filterChain, times(1)).doFilter(request, response);
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }

    @Test
    void doFilterInternal_WithMalformedToken_ShouldNotAuthenticateUser() throws ServletException, IOException {
        // Setup
        request.addHeader("Authorization", "InvalidFormat " + TEST_TOKEN);

        // Execute
        jwtAuthenticationFilter.doFilterInternal(request, response, filterChain);

        // Verify
        verify(filterChain, times(1)).doFilter(request, response);
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }

    @Test
    void doFilterInternal_WithExpiredToken_ShouldNotAuthenticateUser() throws ServletException, IOException {
        // Setup
        request.addHeader("Authorization", "Bearer " + TEST_TOKEN);
        when(jwtProvider.validateToken(TEST_TOKEN)).thenReturn(false);

        // Execute
        jwtAuthenticationFilter.doFilterInternal(request, response, filterChain);

        // Verify
        verify(filterChain, times(1)).doFilter(request, response);
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }

    @Test
    void doFilterInternal_WhenUserNotFound_ShouldNotAuthenticateUser() throws ServletException, IOException {
        // Setup
        request.addHeader("Authorization", "Bearer " + TEST_TOKEN);
        when(jwtProvider.validateToken(TEST_TOKEN)).thenReturn(true);
        when(jwtProvider.getEmailFromJwt(TEST_TOKEN)).thenReturn(TEST_USERNAME);
        when(userDetailsService.loadUserByUsername(TEST_USERNAME))
            .thenThrow(new RuntimeException("User not found"));

        // Execute
        jwtAuthenticationFilter.doFilterInternal(request, response, filterChain);

        // Verify
        verify(filterChain, times(1)).doFilter(request, response);
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }

    @Test
    void doFilterInternal_WithExistingAuthentication_ShouldPreserveAuthentication() throws ServletException, IOException {
        // Setup
        Authentication existingAuth = new UsernamePasswordAuthenticationToken(
            TEST_USERNAME, null, Collections.emptyList());
        SecurityContextHolder.getContext().setAuthentication(existingAuth);
        request.addHeader("Authorization", "Bearer " + TEST_TOKEN);

        // Execute
        jwtAuthenticationFilter.doFilterInternal(request, response, filterChain);

        // Verify
        verify(filterChain, times(1)).doFilter(request, response);
        assertEquals(existingAuth, SecurityContextHolder.getContext().getAuthentication());
    }
} 