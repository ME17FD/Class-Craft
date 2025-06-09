package com.ClassCraft.site.security;

import java.io.IOException;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletResponse;

@ExtendWith(MockitoExtension.class)
class JwtAuthenticationFilterTest {

    @Mock
    private JwtProvider jwtProvider;

    @Mock
    private CustomUserDetailsService customUserDetailsService;

    @InjectMocks
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    private MockHttpServletRequest request;
    private MockHttpServletResponse response;
    private FilterChain filterChain;
    private static final String TEST_TOKEN = "test.jwt.token";
    private static final String TEST_EMAIL = "test@example.com";

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
        UserDetails userDetails = new User(TEST_EMAIL, "password", Collections.emptyList());
        
        when(jwtProvider.validateToken(TEST_TOKEN)).thenReturn(true);
        when(jwtProvider.getEmailFromJwt(TEST_TOKEN)).thenReturn(TEST_EMAIL);
        when(customUserDetailsService.loadUserByUsername(TEST_EMAIL)).thenReturn(userDetails);
        when(jwtProvider.validateToken(TEST_TOKEN, userDetails)).thenReturn(true);
        doNothing().when(filterChain).doFilter(request, response);

        // Execute
        jwtAuthenticationFilter.doFilterInternal(request, response, filterChain);

        // Verify
        verify(filterChain).doFilter(request, response);
        assertNotNull(SecurityContextHolder.getContext().getAuthentication());
        assertEquals(TEST_EMAIL, SecurityContextHolder.getContext().getAuthentication().getName());
    }

    @Test
    void doFilterInternal_WithInvalidToken_ShouldNotAuthenticateUser() throws ServletException, IOException {
        // Setup
        request.addHeader("Authorization", "Bearer " + TEST_TOKEN);
        when(jwtProvider.validateToken(TEST_TOKEN)).thenReturn(false);
        doNothing().when(filterChain).doFilter(request, response);

        // Execute
        jwtAuthenticationFilter.doFilterInternal(request, response, filterChain);

        // Verify
        verify(filterChain).doFilter(request, response);
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }

    @Test
    void doFilterInternal_WithNoToken_ShouldNotAuthenticateUser() throws ServletException, IOException {
        // Setup
        doNothing().when(filterChain).doFilter(request, response);

        // Execute
        jwtAuthenticationFilter.doFilterInternal(request, response, filterChain);

        // Verify
        verify(filterChain).doFilter(request, response);
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }

    @Test
    void doFilterInternal_WithMalformedToken_ShouldNotAuthenticateUser() throws ServletException, IOException {
        // Setup
        request.addHeader("Authorization", "InvalidFormat " + TEST_TOKEN);
        doNothing().when(filterChain).doFilter(request, response);

        // Execute
        jwtAuthenticationFilter.doFilterInternal(request, response, filterChain);

        // Verify
        verify(filterChain).doFilter(request, response);
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }

    @Test
    void doFilterInternal_WithExpiredToken_ShouldNotAuthenticateUser() throws ServletException, IOException {
        // Setup
        request.addHeader("Authorization", "Bearer " + TEST_TOKEN);
        when(jwtProvider.validateToken(TEST_TOKEN)).thenReturn(false);
        doNothing().when(filterChain).doFilter(request, response);

        // Execute
        jwtAuthenticationFilter.doFilterInternal(request, response, filterChain);

        // Verify
        verify(filterChain).doFilter(request, response);
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }

    @Test
    void doFilterInternal_WhenUserNotFound_ShouldNotAuthenticateUser() throws ServletException, IOException {
        // Setup
        request.addHeader("Authorization", "Bearer " + TEST_TOKEN);
        when(jwtProvider.validateToken(TEST_TOKEN)).thenReturn(true);
        when(jwtProvider.getEmailFromJwt(TEST_TOKEN)).thenReturn(TEST_EMAIL);
        when(customUserDetailsService.loadUserByUsername(TEST_EMAIL))
            .thenThrow(new UsernameNotFoundException("User not found"));
        doNothing().when(filterChain).doFilter(request, response);

        // Execute
        jwtAuthenticationFilter.doFilterInternal(request, response, filterChain);

        // Verify
        verify(filterChain).doFilter(request, response);
        assertNull(SecurityContextHolder.getContext().getAuthentication());
        assertEquals(HttpServletResponse.SC_UNAUTHORIZED, response.getStatus());
        assertEquals("User not found", response.getContentAsString());
    }

    @Test
    void doFilterInternal_WithExistingAuthentication_ShouldPreserveAuthentication() throws ServletException, IOException {
        // Setup
        Authentication existingAuth = new UsernamePasswordAuthenticationToken(
            TEST_EMAIL, null, Collections.emptyList());
        SecurityContextHolder.getContext().setAuthentication(existingAuth);
        request.addHeader("Authorization", "Bearer " + TEST_TOKEN);
        doNothing().when(filterChain).doFilter(request, response);

        // Execute
        jwtAuthenticationFilter.doFilterInternal(request, response, filterChain);

        // Verify
        verify(filterChain).doFilter(request, response);
        assertEquals(existingAuth, SecurityContextHolder.getContext().getAuthentication());
    }
} 