/* ========================================= */
/* $TABLE OF CONTENTS                        */
/* ========================================= */

/*

  > $SECURITY PATCHES

  > $CONDITIONAL LOADERS

    > #WOW PLUGIN

  > $NAVIGATION

    > #STICKY NAVBAR
    > #SMOOTH SCROLL

  > $TIMELINE LOADER
  > $PORTFOLIO

    > #LIGHTBOX
    > #SHOW MORE ITEMS
*/

jQuery(document).ready(function ($) {
  'use strict'

  /* ========================================= */
  /* $CONDITIONAL LOADERS                      */
  /* ========================================= */

  // client device and platform detection
  // to load specific scripts for specific devices
  var client = {
    linux: navigator.platform.match(/linux/i) ? true : false,
    touch:
      'ontouchstart' in window || !!navigator.msMaxTouchPoints ? true : false,
    windows: navigator.platform.match(/win/i) ? true : false,
    mobile: {
      android: navigator.userAgent.match(/Android/i) ? true : false,
      blackberry: navigator.userAgent.match(/BlackBerry/i) ? true : false,
      ios: navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false,
      opera: navigator.userAgent.match(/Opera Mini/i) ? true : false,
      windows: navigator.userAgent.match(/IEMobile/i) ? true : false,
      any: navigator.userAgent.match(
        /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i,
      )
        ? true
        : false,
    },
  }

  // load these scripts for all desktop devices
  if (!client.mobile.any) {
    $.when(
      $.Deferred(function (deferred) {
        $(deferred.resolve)
      }),
    ).done(
      function () {
        /* #WOW PLUGIN */
        /* ============================ */

        new WOW().init({ offset: 50 })
      }, // eof: function
    ) // eof: done
  } //eof: if

  /* ========================================= */
  /* $NAVIGATION                               */
  /* ========================================= */

  /* #STICKY NAVBAR
    /* ===================== */

  // this piece of code used to
  // fix the navigation bar at the top
  // of the viewport while scrolling
  if ($().stick_in_parent) {
    $('#navigation').stick_in_parent()
  }

  /* #SMOOTH SCROLL
    /* ===================== */

  // smooth scroll page on navigation link click
  // useing page2id plugin
  if ($().mPageScroll2id) {
    $('.navbar-nav a, .btn-hire, #splitted-home-btn').mPageScroll2id({
      offset: '.navbar-header',
    })
  }

  /* ========================================= */
  /* $TIMELINE LOADER                          */
  /* ========================================= */

  var timeline = $('.timeline')

  timeline.each(function () {
    var $self = $(this),
      relatedShowMoreBtn = $self.find('.timeline-loader-btn'),
      relatedItems = $self.find('.timeline-item'),
      relatedHiddenItems = relatedItems.filter(':hidden'),
      numberOfRelatedHiddenItems = relatedHiddenItems.length

    if (numberOfRelatedHiddenItems !== 0) {
      // if there are hidden items then
      // on show more button show all the hidden items
      // in the current timeline
      relatedShowMoreBtn.on('click', function (event) {
        event.preventDefault()

        // show hidden items
        relatedHiddenItems.removeClass('hidden')

        // hide show more button
        relatedShowMoreBtn.hide()
      })
    } else {
      // hide more button if there are no items
      // to show on page load
      relatedShowMoreBtn.hide()
    }
  })

  /* ========================================= */
  /* $PORTFOLIO                                */
  /* ========================================= */

  /* #LIGHTBOX
    /* ===================== */

  // show lightbox with larger image on
  // clicking zoon button in portfolio item
  // useing magnificPopup plugin
  if ($().magnificPopup) {
    $('.zoom-btn').magnificPopup({ type: 'image' })
  }

  /* #SHOW MORE ITEMS
    /* ===================== */

  // this is a custom script made to
  // lazy load portfolio items which already
  // exists in the page but without images
  // it resets the background of portfolio
  // item on clicking show more button
  // saving alot of http requests on the
  // first page load

  // config
  var maxItemsToload = 5,
    // elements
    portfolioItemsHolder = $('.portfolio-items'),
    portfolioItems = portfolioItemsHolder.find('> div'),
    queuedToLoadItems = portfolioItems.filter(':hidden'),
    loadMoreBtnHolder = $('#load-more-btn-holder'),
    loadMoreBtn = $('#load-more-btn'),
    itemsToLoad,
    bgImageSrc,
    // getters
    totalItemsNumber = portfolioItems.length,
    numberOfQueuedToLoadItems = queuedToLoadItems.length,
    loadMoreBtnOriginalClasses = loadMoreBtn.attr('class'),
    loadMoreBtnOriginalText = loadMoreBtn.text(),
    // setters
    loadingErrorMessage = 'Error Loading Some Items',
    currentlyLoadingMessage = 'Loading Items...'

  // resetting z-index to prevent the overlapping
  // of the hidden items when it is shown
  portfolioItems.each(function () {
    var $self = $(this),
      currentIndex = $self.index()

    $self.css('z-index', totalItemsNumber - currentIndex - 1)
  })

  // functionality
  if (numberOfQueuedToLoadItems) {
    loadMoreBtn.on(
      'click',
      function (event) {
        // disable default link action
        event.preventDefault()

        // vars
        var lastVisibleItem = portfolioItems.filter(':visible').last()

        // recollect items queued for loading
        // with exception for elements that are already processed before
        // this is made to avoid re-processing the
        // elements with error in loading images
        queuedToLoadItems = portfolioItems.filter(':hidden').not('.processed')

        // store max items to load
        itemsToLoad = lastVisibleItem.nextAll(':lt(' + maxItemsToload + ')')

        // add ".processed" class to flag items to be loaded
        // useful in avoiding showing items in case of
        // their related images are not loaded for any reason
        itemsToLoad.addClass('processed')

        // trigger loading indicator
        loadMoreBtn.addClass('em').text(currentlyLoadingMessage)

        console.log(itemsToLoad.length)

        // set the background src
        var imgError = false,
          numberOfItemsToLoad = itemsToLoad.length - 1

        itemsToLoad.each(function (index) {
          var $self = $(this)

          // get [data-bg-src] atrribute value
          bgImageSrc = $self.attr('data-bg-src')

          // set the background of the current
          // processed element to data-bg-src value
          $self.css('background-image', 'url(' + bgImageSrc + ')')

          $('<img src=' + bgImageSrc + '>').load(function () {
            $(this).remove()

            // show images
            if (index === numberOfItemsToLoad) {
              // load all items
              itemsToLoad.removeClass('hidden').addClass('portfolio-item')

              // needed to fix suffle gutter bug
              // and show the hidden items correctly
              // when loading items in any sub category
              $(window).trigger('resize')

              // reset buttons
              resetLoadMoreBtn()

              // remaining items
              if (
                portfolioItems.filter(':hidden').not('.processed').length === 0
              ) {
                loadMoreBtnHolder.hide()
              } // eof: if
            }
          })
        })
      }, // eof: function
    ) // eof: on
  } // eof: if
  else {
    loadMoreBtnHolder.hide()
  } // eof: else

  // reset load more button
  function resetLoadMoreBtn() {
    loadMoreBtn.attr('class', loadMoreBtnOriginalClasses)
    loadMoreBtn.text(loadMoreBtnOriginalText)
  }
})
