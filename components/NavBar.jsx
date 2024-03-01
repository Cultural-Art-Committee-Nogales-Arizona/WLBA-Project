'use  client'

import { useState, useEffect, useContext } from 'react'
import {
  Collapse,
  Container,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap'
import { useUser } from '@auth0/nextjs-auth0/client'
import Logo from '@/public/Logo'
import CustomUserContext from './GlobalUserContext'; 

import styles from './NavBar.module.css'

import PageLink from './PageLink'
import AnchorLink from './AnchorLink'
import ChangeLanguage from './LanguageButton'

import Cookies from 'js-cookie'

const NavBar = () => {
  const { globalUserData, setGlobalUserData } = useContext(CustomUserContext)
  const [isOpen, setIsOpen] = useState(false)
  const { user, isLoading } = useUser()
  const toggle = () => setIsOpen(!isOpen)

  const handleLogout = async () => {
    Cookies.remove('token', { path: '/' })
  }

  // Fetch custom user data when the component mounts
  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal
    try {

      if (user) {
        const token = Cookies.get('token')

        const adminAuthId = token ? true : false

        // Example fetch function to get custom user data
        const fetchCustomUserData = async () => {
          // Perform your fetch to get custom user data
          const response = await fetch(`/api/user/account?email=${user.nickname}`, { signal, method: 'GET' })

          if (response.ok) {
            const responseData = await response.json()
            
            setGlobalUserData(prev => ({
              ...prev,
              ...responseData.data,
              adminAuthId: adminAuthId
            }))
          }
        }

        fetchCustomUserData()
      }
    } catch (error) {
      console.error(error)
    }
    
  }, [user?.name])
  
  return (
    <div className={styles.nav_container} data-testid="navbar" >
      <Navbar className={styles.navbar}  expand="md">
        <a href="/">
          <Logo scale="75" />
        </a>
        <Container>
          <NavbarToggler onClick={toggle} data-testid="navbar-toggle"  /> 
          <Collapse isOpen={isOpen} navbar>
            <Nav className="m-auto" navbar data-testid="navbar-items">
              <NavItem>
                <PageLink href="/" className="nav-link" testId="navbar-home">
                  <span className={styles.link_animation}>Home</span>
                </PageLink>
              </NavItem>
              <NavItem>
                <PageLink href="/about-us" className="nav-link" testId="navbar-ssr">
                  <span className={styles.link_animation}>About Us</span>
                </PageLink>
              </NavItem>
              <NavItem>
                <PageLink href="/volunteer" className="nav-link" testId="navbar-external">
                  <span className={styles.link_animation}>Volunteer</span>
                </PageLink>
              </NavItem>
              {/* REPLACE "href" WITH STRIPE LINK */}
              {/* <NavItem>
                <a href="STRIPE DONATE LINK" target="_blank" className="nav-link" >
                  <span className={styles.link_animation}>Donate</span>
                </a>
              </NavItem> */}
            </Nav>
            <Nav className="d-none d-md-block" navbar>
              {!isLoading && !user && (
                <NavItem id="qsLoginBtn">
                  <AnchorLink
                    href="/api/auth/login"
                    className={styles.login}
                    tabIndex={0}
                    testId="navbar-login-desktop">
                    <span className={styles.login}>Log in</span>
                  </AnchorLink>
                </NavItem>
              )}
              {user && (
                <UncontrolledDropdown nav inNavbar data-testid="navbar-menu-desktop">
                  <DropdownToggle nav caret id="profileDropDown">
                    <img
                      src={user.picture}
                      alt="Profile"
                      className="nav-user-profile rounded-circle"
                      width="50"
                      height="50"
                      decode="async"
                      data-testid="navbar-picture-desktop"
                    />
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem header data-testid="navbar-user-desktop">
                      {user.name}
                    </DropdownItem>
                    <DropdownItem>
                      <AnchorLink href="/vendor" icon="user" testId="navbar-vendor-desktop">
                        Vendor Center
                      </AnchorLink>
                    </DropdownItem>
                    {globalUserData.adminAuthId ? 
                    <DropdownItem className="dropdown-profile" tag="span">
                      <PageLink href="/dashboard" icon="user" testId="navbar-profile-desktop">
                        Dashboard
                      </PageLink>
                    </DropdownItem> : null
                    }
                    {globalUserData.admin && !globalUserData.adminAuthId ?  
                    <DropdownItem className="dropdown-profile" tag="span">
                      <PageLink href="/dashboard/admin/sign-in" icon="user" testId="navbar-profile-desktop">
                        Admin Sign in
                      </PageLink>
                    </DropdownItem> : null
                    }
                    <DropdownItem id="qsLogoutBtn"  onClick={handleLogout}>
                      <AnchorLink href="/api/auth/logout" icon="power-off" testId="navbar-logout-desktop">
                        Log out
                      </AnchorLink>
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              )}
            </Nav>
            {!isLoading && !user && (
              <Nav className="d-md-none" navbar>
                <AnchorLink
                  href="/api/auth/login"
                  className="btn btn-primary btn-block"
                  tabIndex={0}
                  testId="navbar-login-mobile">
                  <span className={styles.login}>Log in</span>
                </AnchorLink>
              </Nav>
            )}
            {user && (
              <Nav
                id="nav-mobile"
                className="d-md-none justify-content-between"
                navbar
                data-testid="navbar-menu-mobile">
                <NavItem>
                  <span className="user-info">
                    <img
                      src={user.picture}
                      alt="Profile"
                      className="nav-user-profile d-inline-block rounded-circle mr-3"
                      width="50"
                      height="50"
                      decode="async"
                      data-testid="navbar-picture-mobile"
                    />
                    <h6 className="d-inline-block" data-testid="navbar-user-mobile">
                      {user.name}
                    </h6>
                  </span>
                </NavItem>
                {globalUserData.adminAuthId ? 
                  <NavItem className="dropdown-profile" tag="span">
                    <AnchorLink href="/dashboard" icon="user" testId="navbar-profile-desktop">
                      Dashboard
                    </AnchorLink>
                  </NavItem> : null
                }
                {globalUserData.admin && !globalUserData.adminAuthId ?  
                  <NavItem className="dropdown-profile" tag="span">
                    <AnchorLink href="/dashboard/admin/sign-in" icon="user" testId="navbar-profile-desktop">
                      Admin Sign in
                    </AnchorLink>
                  </NavItem> : null
                }
                <NavItem id="qsLogoutBtn">
                  <AnchorLink
                    href="/api/auth/logout"
                    className="btn btn-link p-0"
                    icon="power-off"
                    testId="navbar-logout-mobile">
                    Log out
                  </AnchorLink>
                </NavItem>
              </Nav>
            )}
            <ChangeLanguage />
          </Collapse>
        </Container>
      </Navbar>
    </div>
  )
}

export default NavBar
