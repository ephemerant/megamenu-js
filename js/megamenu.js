/* global $ */
$(document).ready(function () {
    'use strict';

    var columnPercentageWidth = 25; // Each column in the megamenu dropdown is this wide        
    var mobileWidth = 943; // Width for when to switch over to mobile mode

    var $menuContainer = $('.menu-container > .menu'); // Menu container (you may want to use a more specific class name or ID)
    var $menu = $menuContainer.find('> ul'); // Menu list that directly contains menu items
    var $menuItems = $menu.find('> li'); // Each menu navigation item and its megamenu    
    var $megaMenus = $menuItems.find('> ul'); // The actual megamenu dropdowns

    // Checks if li has sub (ul) and adds class for toggle icon - just an UI
    $menuItems.has('> ul').addClass('menu-dropdown-icon');

    // Checks if drodown menu's li elements have anothere level (ul), if not the dropdown is shown as regular dropdown, not a mega menu (thanks Luka Kladaric)
    $menuItems.find('> ul:not(:has(ul))').addClass('normal-sub');

    // Adds menu-mobile class (for mobile toggle menu) before the normal menu
    // Mobile menu is hidden if width is more then 959px, but normal menu is displayed
    // Normal menu is hidden if width is below 959px, and jquery adds mobile menu
    // Done this way so it can be used with wordpress without any trouble
    $menu.before('<a href=\'#\' class=\'menu-mobile\'>Navigation</a>');

    // Set flex as default display state (rather than block)
    $megaMenus.css('display', 'flex').hide();

    // Set menu width based on number of columns
    $megaMenus.each(function (n, menu) {
        var $menu = $(menu);
        $menu.css('width', $menu.find('> li').length * columnPercentageWidth + '%');
    });

    // If window width is more than "mobileWidth" dropdowns are displayed on hover
    $menuItems.hover(
        function (e) {
            if ($(window).width() > mobileWidth) {
                $(this).children('ul').fadeIn(150);
                e.preventDefault();
            }
        }, function (e) {
            if ($(window).width() > mobileWidth) {
                $(this).children('ul').fadeOut(150);
                e.preventDefault();
            }
        }
    );

    // If window width is less or equal to mobileWidthpx dropdowns are displayed on click (thanks Aman Jain from stackoverflow)
    $menuItems.click(function () {
        if ($(window).width() < mobileWidth) {
            $(this).children('ul').fadeToggle(150);
        }
    });

    // When clicked on mobile-menu, normal menu is shown as a list, classic rwd menu story (thanks mwl from stackoverflow)
    $menuContainer.find('.menu-mobile').click(function (e) {
        $menu.toggleClass('show-on-mobile');
        e.preventDefault();
    });

    // Scooch boxes to the right in order be left-aligned their with corresponding menu items, as much as possible
    function realignBoxes() {
        $megaMenus.each(function (n, megaMenu) {
            var $megaMenu = $(megaMenu);
            var $navItem = $megaMenu.parent();

            // Don't shift if it's full width
            if ($megaMenu.find('> li').length * columnPercentageWidth >= 100)
                return;           

            // Calculate how much to shift by
            var leftOffset = $navItem.offset().left - $menu.offset().left;
            var navWidth = $megaMenu.outerWidth();
            var rightLimit = $menu.outerWidth();

            // See if we can move it as far to the left as we would like
            if (leftOffset + navWidth > rightLimit)
                leftOffset = rightLimit - navWidth;

            $megaMenu.css('left', leftOffset);
        });
    }

    realignBoxes();
    
    $(window).resize(function() {
        if ($(window).width() > mobileWidth)
            $menu.removeClass('show-on-mobile');

        realignBoxes();
    });
});
