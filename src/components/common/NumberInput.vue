<template>
  <el-input
    ref="input"
    :value="localValue"
    :class="inputClass"
    :placeholder="inputPlaceholder"
    :name="inputName"
    type="number"
    @input="onInput"
  >
    <slot name="r"/>
  </el-input>
</template>

<script>
export default {
  name: 'NumberInput',
  props: {
    inputModel: {
      type: String,
      default: ''
    },
    inputPlaceholder: {
      type: Number,
      default: 0
    },
    inputClass: {
      type: [Array, String],
      default: ''
    },
    inputName: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      localValue: '',

      validSymbols: new RegExp(/^[0-9.]+$/)
    }
  },
  created () {
    this.localValue = this.inputModel
    // console.log(this.inputModel)
  },
  methods: {
    onInput (v) {
      if (!v.length) {
        this.$emit('update:inputModel', '')
        return
      }
      console.log(v)
      console.log(this.validSymbols.test(v))
      if (this.validSymbols.test(String(v))) {
        this.localValue = v
        this.$emit('update:inputModel', v)
      } else {
        console.log('here', v)
        this.$refs.input.currentValue = this.localValue
      }
    }
  }
}
</script>
