import { inject } from 'vue'
import { createDisplay, VuetifyDisplaySymbol } from './composables/display'
import { createTheme, VuetifyThemeSymbol } from './composables/theme'
import { mergeDeep } from '@/util'
import { defaultSets, VuetifyIconSymbol } from '@/composables/icons'
import { aliases, mdi } from '@/iconsets/mdi'

// Types
import type { App, InjectionKey } from 'vue'
import type { DisplayOptions } from '@/composables/display'
import type { ThemeOptions } from '@/composables/theme'
import type { IconOptions } from '@/composables/icons'

export interface VuetifyComponentDefaults {
  [key: string]: undefined | Record<string, unknown>
  global: Record<string, unknown>
}

export interface VuetifyInstance {
  defaults: VuetifyComponentDefaults
}

export interface VuetifyOptions {
  components?: Record<string, any>
  directives?: Record<string, any>
  defaults?: Partial<VuetifyComponentDefaults>
  display?: Partial<DisplayOptions>
  theme?: ThemeOptions
  icons?: IconOptions
}

export const VuetifySymbol: InjectionKey<VuetifyInstance> = Symbol.for('vuetify')

export const useVuetify = () => {
  const vuetify = inject(VuetifySymbol)

  if (!vuetify) {
    throw new Error('Vuetify has not been installed on this app')
  }

  return vuetify
}

export const createVuetify = (options: VuetifyOptions = {}) => {
  const install = (app: App) => {
    const {
      components = {},
      directives = {},
      defaults = {},
      icons = {},
    } = options

    for (const key in directives) {
      const directive = directives[key]

      app.directive(key, directive)
    }

    for (const key in components) {
      const component = components[key]

      app.component(key, component)
    }

    const vuetify: VuetifyInstance = {
      defaults: {
        global: {},
        ...defaults,
      },
    }

    app.provide(VuetifySymbol, vuetify)
    app.provide(VuetifyDisplaySymbol, createDisplay(options.display))
    app.provide(VuetifyThemeSymbol, createTheme(options.theme))
    app.provide(VuetifyIconSymbol, mergeDeep({
      defaultSet: 'mdi',
      sets: {
        ...defaultSets,
        mdi,
      },
      aliases,
    }, icons))
    app.config.globalProperties.$vuetify = vuetify
  }

  return { install }
}
