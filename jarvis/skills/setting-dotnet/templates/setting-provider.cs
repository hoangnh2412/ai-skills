using Jarvis.Modules.Setting.Definitions;

public sealed class AppSettingDefinition : ISettingDefinitionProvider
{
  public const string GroupName = "App";

  public void Define(ISettingDefinitionContext context)
  {
    context.AddGroup(GroupName);
    context.AddSetting(GroupName, "Title", s => s.DefaultValue = "MyApp");
  }
}
