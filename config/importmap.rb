# frozen_string_literal: true

# Pin npm packages by running ./bin/importmap

pin 'application'
pin '@hotwired/turbo-rails', to: 'turbo.min.js'
pin '@hotwired/stimulus', to: 'stimulus.min.js'
pin '@hotwired/stimulus-loading', to: 'stimulus-loading.js'
pin_all_from 'app/javascript/controllers', under: 'controllers'
pin 'posts', to: 'posts.js'
pin 'schedules', to: 'schedules.js'
pin 'memos', to: 'memos.js'
pin 'presets', to: 'presets.js'
pin 'likes', to: 'likes.js'
pin 'profile', to: 'profile.js'
