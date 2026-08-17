# Workflow: Thêm Setting provider

Áp dụng khi **đã có** `AddCoreSetting` và cần thêm Group/Key.

## Checklist

```text
- [ ] 1. Class ISettingDefinitionProvider — AddGroup / AddSetting
- [ ] 2. AddProvider<T>() trên fluent builder
- [ ] 3. Duplicate Key = fail-fast (Library)
```

Mẫu: [templates/setting-provider.cs](../templates/setting-provider.cs).
